"""Link preview (unfurl) for chat messages.

Why this is a server endpoint and not a fetch() in the browser: CORS stops a
page reading another site's HTML, and even if it did not, unfurling client-side
would hand the linked site the IP of every person who merely *reads* the
message. Slack unfurls server-side for exactly this reason. (WhatsApp does the
opposite and unfurls on the sender's device — it has no choice, since its
servers cannot read an end-to-end encrypted message.)

SECURITY — this endpoint takes a URL from a user and makes the server fetch it,
which is textbook SSRF territory. Without guards, any logged-in user could point
it at http://127.0.0.1:8000/api/admin/..., at a cloud metadata endpoint
(169.254.169.254), or at anything else inside the network perimeter, and read
the response through the preview card. So:

  * login required — never an open proxy for the internet at large;
  * http/https only — no file://, gopher://, redis:// and so on;
  * default ports only;
  * every hostname is resolved and every resolved address checked against the
    private, loopback, link-local, reserved and multicast ranges;
  * redirects are followed MANUALLY, re-validating each hop, because a public
    URL is free to 302 straight to 169.254.169.254;
  * response read is capped and timed out, so a hostile server cannot stream
    gigabytes or hold the connection open.

Residual risk worth naming rather than papering over: between our DNS check and
httpx's own resolution there is a TOCTOU window a determined DNS-rebinding
attacker could aim at. Closing it properly means pinning the connection to the
validated IP. Given this endpoint is behind login and returns only five short
metadata fields, that trade-off is deliberate, not overlooked.
"""
import ipaddress
import re
import socket
import time
from html import unescape
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse

import httpx
from fastapi import APIRouter, Depends, HTTPException, Query

from deps import current_user

router = APIRouter(tags=["unfurl"])

TIMEOUT = 5.0
MAX_BYTES = 256 * 1024          # metadata lives in <head>; never read a whole page
MAX_REDIRECTS = 3
CACHE_TTL = 3600                # a preview is not worth re-fetching every render
CACHE_MAX = 500
UA = "DevLifeBot/1.0 (+link preview)"

_cache: dict[str, tuple[float, dict]] = {}


def _blocked_ip(host: str) -> str | None:
    """Resolve `host` and reject anything that is not a public address."""
    try:
        infos = socket.getaddrinfo(host, None)
    except socket.gaierror:
        return "could not resolve host"
    for info in infos:
        try:
            ip = ipaddress.ip_address(info[4][0])
        except ValueError:
            return "unresolvable address"
        if (
            ip.is_private
            or ip.is_loopback
            or ip.is_link_local
            or ip.is_reserved
            or ip.is_multicast
            or ip.is_unspecified
        ):
            return f"address {ip} is not public"
    return None


def _validate(url: str) -> str | None:
    """None if the URL is safe to fetch, else the reason it is not."""
    try:
        p = urlparse(url)
    except ValueError:
        return "malformed URL"
    if p.scheme not in ("http", "https"):
        return "only http and https are supported"
    if not p.hostname:
        return "missing host"
    if p.port is not None and p.port not in (80, 443):
        return "only the default ports are allowed"
    return _blocked_ip(p.hostname)


class _MetaParser(HTMLParser):
    """Pull the handful of tags a preview card needs out of <head>.

    Deliberately stdlib: BeautifulSoup is not installed here, and adding a
    dependency to read six meta tags is not a good trade.
    """

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.meta: dict[str, str] = {}
        self.icon: str | None = None
        self.title: str | None = None
        self._in_title = False
        self.done = False

    def handle_starttag(self, tag, attrs):
        a = {k.lower(): (v or "") for k, v in attrs}
        if tag == "meta":
            # OG uses property=, Twitter and the classic description use name=.
            key = (a.get("property") or a.get("name") or "").lower()
            content = a.get("content", "").strip()
            if key and content and key not in self.meta:
                self.meta[key] = content
        elif tag == "link":
            rels = (a.get("rel") or "").lower().split()
            if not self.icon and ("icon" in rels or "shortcut" in rels):
                self.icon = a.get("href")
        elif tag == "title":
            self._in_title = True
        elif tag == "body":
            self.done = True          # metadata is in <head>; stop reading

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False
        elif tag == "head":
            self.done = True

    def handle_data(self, data):
        if self._in_title and not self.title:
            t = data.strip()
            if t:
                self.title = t


def _clean(s: str | None, limit: int) -> str | None:
    if not s:
        return None
    s = unescape(re.sub(r"\s+", " ", s)).strip()
    if not s:
        return None
    return s if len(s) <= limit else s[: limit - 1].rstrip() + "…"


async def _fetch(url: str) -> tuple[str, str, str]:
    """Follow redirects by hand, validating every hop.

    Returns (final_url, html, content_type). The content type is part of the
    return because a link straight to a .jpg has no HTML and therefore no
    metadata — the caller needs to know it was an image rather than conclude
    there is nothing to show.
    """
    async with httpx.AsyncClient(
        follow_redirects=False, timeout=TIMEOUT, headers={"User-Agent": UA, "Accept": "text/html,*/*"}
    ) as client:
        for _ in range(MAX_REDIRECTS + 1):
            reason = _validate(url)
            if reason:
                raise HTTPException(400, f"Refusing to fetch: {reason}")
            async with client.stream("GET", url) as r:
                if r.is_redirect:
                    nxt = r.headers.get("location")
                    if not nxt:
                        raise HTTPException(502, "Redirect without a location")
                    url = urljoin(url, nxt)
                    continue
                if r.status_code >= 400:
                    raise HTTPException(502, f"Upstream returned {r.status_code}")
                ctype = r.headers.get("content-type", "")
                if "html" not in ctype.lower():
                    # An image or PDF link has no metadata to read.
                    return str(r.url), "", ctype
                buf = bytearray()
                async for chunk in r.aiter_bytes():
                    buf.extend(chunk)
                    if len(buf) >= MAX_BYTES:
                        break
                return str(r.url), buf.decode(r.encoding or "utf-8", errors="replace"), ctype
    raise HTTPException(502, "Too many redirects")


@router.get("")
@router.get("/")
async def unfurl(url: str = Query(..., max_length=2048), user=Depends(current_user)):
    """Metadata for a link, for rendering a preview card in chat."""
    hit = _cache.get(url)
    if hit and time.time() - hit[0] < CACHE_TTL:
        return hit[1]

    reason = _validate(url)
    if reason:
        raise HTTPException(400, f"Refusing to fetch: {reason}")

    final_url, html, ctype = await _fetch(url)

    # A direct image link is the common case in this chat — people paste the
    # Cloudinary URL of something they just uploaded. There is no HTML to
    # unfurl, so the image IS the preview, exactly as Slack and WhatsApp treat
    # it. Returning "no metadata" here would be technically true and useless.
    if ctype.lower().startswith("image/"):
        host = (urlparse(final_url).hostname or "").replace("www.", "")
        out = {
            "url": final_url,
            "type": "image",
            "title": None,
            "description": None,
            "image": final_url,
            "siteName": host,
            "favicon": urljoin(final_url, "/favicon.ico"),
        }
        if len(_cache) >= CACHE_MAX:
            _cache.pop(next(iter(_cache)))
        _cache[url] = (time.time(), out)
        return out

    p = _MetaParser()
    if html:
        try:
            p.feed(html)
        except Exception:
            pass      # a malformed page should yield a thin card, not a 500

    m = p.meta
    image = m.get("og:image") or m.get("twitter:image") or m.get("twitter:image:src")
    icon = p.icon

    out = {
        "url": m.get("og:url") or final_url,
        "type": "link",
        "title": _clean(m.get("og:title") or m.get("twitter:title") or p.title, 120),
        "description": _clean(m.get("og:description") or m.get("twitter:description") or m.get("description"), 200),
        # Relative og:image paths are common and break every preview that does
        # not resolve them — this app's own index.html has exactly that bug.
        "image": urljoin(final_url, image) if image else None,
        "siteName": _clean(m.get("og:site_name"), 60),
        "favicon": urljoin(final_url, icon) if icon else urljoin(final_url, "/favicon.ico"),
    }

    if len(_cache) >= CACHE_MAX:
        _cache.pop(next(iter(_cache)))
    _cache[url] = (time.time(), out)
    return out
