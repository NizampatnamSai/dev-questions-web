import { useState, useEffect } from "react";
import api from "../api/axios";

// Link preview card for chat messages — the "unfurl" Slack and WhatsApp show.
//
// The fetch HAS to happen on the server: a browser cannot read another site's
// HTML because of CORS, and even if it could, doing it from the client would
// leak every reader's IP to whatever was linked. /api/unfurl does the fetch,
// strips the metadata and hands back just the five fields the card needs.

// Shared across every message on screen, so ten people pasting the same link
// cost one request, and scrolling back through history re-renders from memory
// instead of re-fetching. `null` is cached too — a URL with no usable metadata
// should not be retried on every repaint.
const cache = new Map();
const inflight = new Map();

/** First http(s) URL in a message, or null. Mirrors AdminChat's URL_TEST_RE. */
export function firstUrl(html) {
  if (!html) return null;
  // Strip tags first: linkifyHtml has already wrapped URLs in <a href>, so the
  // raw html contains each link twice and the attribute copy may be escaped.
  const text = html.replace(/<[^>]*>/g, " ");
  const m = text.match(/https?:\/\/[^\s<"']+/);
  if (!m) return null;
  // Trailing punctuation is almost never part of the link.
  return m[0].replace(/[.,;:!?)\]]+$/, "");
}

async function unfurl(url) {
  if (cache.has(url)) return cache.get(url);
  if (inflight.has(url)) return inflight.get(url);
  const p = api
    .get("/unfurl", { params: { url } })
    .then(({ data }) => {
      const value = data && (data.title || data.description || data.image) ? data : null;
      cache.set(url, value);
      return value;
    })
    .catch(() => {
      cache.set(url, null); // a failed unfurl is a permanent "no card" for this session
      return null;
    })
    .finally(() => inflight.delete(url));
  inflight.set(url, p);
  return p;
}

export default function LinkPreview({ url, mine }) {
  const [data, setData] = useState(() => cache.get(url) ?? undefined);

  useEffect(() => {
    let alive = true;
    // Hooks must run unconditionally, so a message with no link is handled
    // here rather than with an early return above.
    if (!url) {
      setData(null);
      return () => {};
    }
    if (cache.has(url)) {
      setData(cache.get(url));
      return () => {};
    }
    setData(undefined);
    unfurl(url).then((d) => alive && setData(d));
    return () => {
      alive = false;
    };
  }, [url]);

  // undefined = still loading, null = nothing worth showing.
  if (!url || data === null) return null;

  if (data === undefined) {
    return (
      <div className="mt-1.5 rounded-xl border border-black/10 dark:border-white/10 p-2.5 animate-pulse max-w-sm">
        <div className="h-2.5 w-24 rounded bg-black/10 dark:bg-white/10" />
        <div className="h-3 w-40 rounded bg-black/10 dark:bg-white/10 mt-2" />
        <div className="h-2.5 w-52 rounded bg-black/10 dark:bg-white/10 mt-1.5" />
      </div>
    );
  }

  const host = (() => {
    try {
      return new URL(data.url || url).hostname.replace(/^www\./, "");
    } catch {
      return "";
    }
  })();

  // A direct image link shows the picture, not a text card with a thumbnail.
  if (data.type === "image") {
    return (
      <a href={data.url || url} target="_blank" rel="noopener noreferrer" className="mt-1.5 block max-w-xs">
        <img
          src={data.image}
          alt=""
          loading="lazy"
          className="rounded-xl max-h-60 w-auto object-cover border border-black/10 dark:border-white/10"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </a>
    );
  }

  return (
    <a
      href={data.url || url}
      target="_blank"
      rel="noopener noreferrer"
      className={`mt-1.5 block max-w-sm rounded-xl border overflow-hidden transition hover:opacity-90 ${
        mine
          ? "border-white/25 bg-white/10"
          : "border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.04]"
      }`}
    >
      {/* Slack puts the thumbnail beside the text, which keeps a chat bubble
          compact — a full-width hero image would dwarf the message itself. */}
      <div className="flex gap-2.5 p-2.5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {data.favicon && (
              <img src={data.favicon} alt="" className="w-3.5 h-3.5 rounded-sm flex-shrink-0" loading="lazy" />
            )}
            <span className={`text-[10px] truncate ${mine ? "text-white/70" : "text-slate-500 dark:text-slate-400"}`}>
              {data.siteName || host}
            </span>
          </div>
          {data.title && (
            <p className={`text-[12.5px] font-bold leading-snug mt-0.5 line-clamp-2 ${mine ? "text-white" : "text-slate-800 dark:text-slate-100"}`}>
              {data.title}
            </p>
          )}
          {data.description && (
            <p className={`text-[11.5px] leading-snug mt-0.5 line-clamp-2 ${mine ? "text-white/80" : "text-slate-600 dark:text-slate-300"}`}>
              {data.description}
            </p>
          )}
        </div>
        {data.image && (
          <img
            src={data.image}
            alt=""
            loading="lazy"
            className="w-14 h-14 rounded-lg object-cover flex-shrink-0 bg-black/5 dark:bg-white/5"
            onError={(e) => {
              // A dead og:image should not leave a broken-image glyph in the bubble.
              e.currentTarget.style.display = "none";
            }}
          />
        )}
      </div>
    </a>
  );
}
