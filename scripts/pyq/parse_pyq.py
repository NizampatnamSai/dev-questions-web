"""Parse careerpower IBPS PO Prelims PDFs into the ibpspo-pyq.json schema.

The PDFs are two-column. Reading order is left column then right column, per
page, and question numbers ascend across that order. Questions and solutions
live in one linear stream split at the first "S1. Ans".
"""
import pdfplumber, re, json, sys

FOOTER = re.compile(r'^.*(sscadda|bankersadda|careerpower|Adda247).*$', re.M | re.I)


def gutter(page):
    """X to split a two-column page at, or None when the page is single-column.

    Returning w/2 as a blanket fallback was wrong: a handful of pages really are
    single-column, and cutting those at the midpoint sliced every line in half
    ("a few senten" | "nces are given"). Score candidate split points by how many
    text lines they cut through — a real gutter cuts almost none.
    """
    w = page.width
    words = page.extract_words()
    if not words:
        return None
    # Grouping words into "lines" by y is circular here — two columns at the
    # same height merge into one full-width row, making every two-column page
    # look single-column. Judge by vertical whitespace instead: a gutter is a
    # band of x that no word occupies, straddling the page centre.
    # The running footer ("www.sscadda.com | ... | Adda247 App") is one
    # full-width line at the foot of EVERY page. Left in, it bridges the gutter
    # on every page, no gap is ever found, and both columns get interleaved.
    top, bot = 0.06 * page.height, 0.94 * page.height
    body = [wd for wd in words if top < wd['top'] < bot
            and not re.search(r'sscadda|bankersadda|careerpower|Adda247', wd['text'], re.I)]
    if not body:
        return None
    spans = [(wd['x0'], wd['x1']) for wd in body]
    # A single centred heading ("Previous" in the title, "Solutions" at the
    # section break) is enough to bridge the gutter, so demanding a completely
    # empty band lost page 1 of most papers. Score each candidate by how many
    # words it cuts and accept the best if only a handful do.
    best = None
    for x in range(int(0.35 * w), int(0.65 * w)):
        cut = sum(1 for a, b in spans if a < x < b)
        d = abs(x - w / 2)
        if best is None or (cut, d) < (best[0], best[1]):
            best = (cut, d, x)
    cut, _, x = best
    return x if cut <= 3 else None


def _gutter_by_gap(page):
    """X of the widest word-free vertical band near the middle of the page.

    A fixed w/2 split bleeds text between columns: any line whose glyphs cross
    the midpoint lands in BOTH crops, which injected fragments of the right
    column into left-column question stems. The real gutter is where no word
    sits, so find it from the words themselves.
    """
    w = page.width
    spans = sorted((wd['x0'], wd['x1']) for wd in page.extract_words())
    if not spans:
        return w / 2
    gaps, cur_end = [], spans[0][1]
    for x0, x1 in spans[1:]:
        if x0 - cur_end >= 8:                  # ignore inter-word whitespace
            gaps.append((cur_end, x0))
        cur_end = max(cur_end, x1)
    if not gaps:
        return w / 2
    # The true gutter straddles the page centre. Picking the WIDEST gap instead
    # chose ragged whitespace inside a column on some pages, which cut the right
    # end off every line in that column and truncated stems mid-word.
    for a, b in gaps:
        if a <= w / 2 <= b:
            return (a + b) / 2
    a, b = min(gaps, key=lambda g: abs((g[0] + g[1]) / 2 - w / 2))
    return (a + b) / 2 if 0.3 * w < (a + b) / 2 < 0.7 * w else w / 2


def strip_chrome(t):
    """Drop the running footer and its stray page number, without touching the
    bare-number lines that make up stacked fractions inside the body."""
    t = FOOTER.sub('', t)
    lines = t.split('\n')
    while lines and re.fullmatch(r'\s*\d{0,3}\s*', lines[-1] or ''):
        lines.pop()
    while lines and re.fullmatch(r'\s*\d{0,3}\s*', lines[0] or ''):
        lines.pop(0)
    return '\n'.join(lines)


def linear_text(path):
    """Full document text in reading order, columns un-interleaved."""
    out = []
    with pdfplumber.open(path) as pdf:
        for p in pdf.pages:
            # Crop against the page's OWN bbox, not (0, 0, width, height). Some
            # sources (the SBI PO papers) carry an offset media box — origin at
            # x=8.36, y=-90.98 — and a (0,0)-based crop falls outside the page,
            # which pdfplumber rejects outright.
            px0, py0, px1, py1 = p.bbox
            g = gutter(p)
            gx = px0 + g if g is not None else None
            bands = [(px0, px1)] if gx is None else [(px0, gx), (gx, px1)]
            for x0, x1 in bands:
                out.append(strip_chrome(p.crop((x0, py0, x1, py1)).extract_text() or ''))
    return '\n'.join(out)


def split_qa(text):
    """Return (question_region, solution_region)."""
    m = re.search(r'\bS\s?1\s*\.?\s*Ans', text)
    return (text[:m.start()], text[m.start():]) if m else (text, '')


OPT = re.compile(r'\((?P<L>[a-e])\)\s*(?P<T>.*?)(?=\n\([a-e]\)|\Z)', re.S)
DIRN = re.compile(r'(Directions?\s*\(\s*\d+\s*[–\-—]\s*\d+\s*\)\s*:.*|Directions?\s*\(\s*\d+\s*\)\s*:.*)', re.S)
DIRN_OPT = re.compile(r'(?m)^\(a\)')


def clean(s):
    s = re.sub(r'[ \t]+', ' ', s or '')
    s = re.sub(r'\n{3,}', '\n\n', s)
    return s.strip()


def parse_questions(region):
    """{n: {'stem':..., 'options':{...}, 'directions': str|None}}"""
    marks = list(re.finditer(r'(?m)^\s*Q\s?(\d{1,3})\s*\.?\s*', region))
    out, pending = {}, None
    for i, m in enumerate(marks):
        n = int(m.group(1))
        # Keep the FIRST hit per number. On the boundary page the left column
        # already holds "S1. Ans" while the right column still holds the last
        # question, so the regions overlap; and 2023 misprints one solution
        # header as "Q52. Ans.(a)", which would otherwise clobber the real Q52.
        if n in out:
            continue
        body = region[m.end(): marks[i + 1].start() if i + 1 < len(marks) else len(region)]
        # A Directions block trails the PREVIOUS question's options; it belongs
        # to the next question as its shared passage/clue block.
        nxt = None
        d = DIRN.search(body)
        if d:
            nxt = clean(d.group(1))
            body = body[:d.start()]
        opts, first = {}, None
        for om in OPT.finditer(body):
            if first is None:
                first = om.start()
            opts[om.group('L').upper()] = clean(om.group('T'))
        stem = clean(body[:first] if first is not None else body)
        out[n] = {'stem': stem, 'options': opts, 'directions': pending}
        pending = nxt

    # Quadratic-equation and inequality sets print their five options ONCE, in
    # the Directions block, and not again under each question. Carry that
    # set-level option list forward until the next Directions block replaces it.
    set_opts = None
    for n in sorted(out):
        d = out[n]['directions']
        if d:
            cand = {om.group('L').upper(): clean(om.group('T')) for om in OPT.finditer(d)}
            if len(cand) == 5:
                set_opts = cand
                # Keep the prose, drop the option list — it becomes the options.
                cut = DIRN_OPT.search(d)
                out[n]['directions'] = clean(d[:cut.start()]) if cut else d
            else:
                set_opts = None
        if len(out[n]['options']) != 5 and set_opts:
            out[n]['options'] = dict(set_opts)
    return out


# Some sources print the answer INLINE, immediately after each question's
# options ("Ans.(e)"), instead of collecting solutions in a separate section at
# the back. Left in place it also corrupts the last option, whose text runs to
# the end of the segment and so swallows the answer line.
INLINE_ANS = re.compile(r'(?m)^\s*Ans\.?\s*\(?\s*([a-e])\s*\)?\s*$')


def parse_inline_answers(region):
    """{n: 'A'..'E'} for papers whose answers sit inside each question block."""
    marks = list(re.finditer(r'(?m)^\s*Q\s?(\d{1,3})\s*\.?\s*', region))
    out = {}
    for i, m in enumerate(marks):
        n = int(m.group(1))
        if n in out:
            continue
        body = region[m.end(): marks[i + 1].start() if i + 1 < len(marks) else len(region)]
        a = INLINE_ANS.search(body)
        if a:
            out[n] = a.group(1).upper()
    return out


def strip_inline_answers(region):
    """Remove the "Ans.(x)" lines so they cannot bleed into the last option."""
    return INLINE_ANS.sub('', region)


def parse_solutions(region):
    """{n: {'ans': 'A'..'E'|None, 'sol': str}}"""
    marks = list(re.finditer(r'(?m)^\s*[SQ]\s?(\d{1,3})\s*\.?\s*Ans', region))
    out = {}
    for i, m in enumerate(marks):
        n = int(m.group(1))
        body = region[m.start(): marks[i + 1].start() if i + 1 < len(marks) else len(region)]
        a = re.search(r'Ans\.?\s*\(?\s*([a-e])\s*\)?', body)
        sol = re.split(r'(?m)^\s*Sol\.?\s*', body, maxsplit=1)
        out[n] = {'ans': a.group(1).upper() if a else None,
                  'sol': clean(sol[1]) if len(sol) > 1 else ''}
    return out


def report(name, qpdf, spdf=None):
    qtext = linear_text(qpdf)
    # Questions are scanned over the WHOLE document (first hit per number wins);
    # only the solution scan needs the split, so a "Q12." inside a solution
    # write-up cannot be mistaken for the question itself.
    sregion = linear_text(spdf) if spdf else split_qa(qtext)[1]
    qregion = qtext
    qs, ss = parse_questions(qregion), parse_solutions(sregion)
    full = [n for n in range(1, 101) if len(qs.get(n, {}).get('options', {})) == 5]
    keyed = [n for n in range(1, 101) if ss.get(n, {}).get('ans')]
    print(f'{name:22} Q={len(qs):3} 5-opt={len(full):3} keys={len(keyed):3} '
          f'missingQ={[n for n in range(1,101) if n not in qs][:6]} '
          f'missingKey={[n for n in range(1,101) if n not in keyed][:6]}')
    return qs, ss


if __name__ == '__main__':
    P = 'client/src/data/pyq-source/'
    report('2023', P + 'prelims-2023.pdf')
    report('2022', P + 'prelims-2022.pdf')
    report('2024', P + 'prelims-2024.pdf')
    report('2025-s1', P + 'prelims-2025-shift1.pdf')
    report('2025-s2', P + 'prelims-2025-shift2.pdf')
    report('2021', P + 'prelims-2021.pdf', P + 'prelims-2021-solutions.pdf')
    report('2020', P + 'prelims-2020.pdf', P + 'prelims-2020-solutions.pdf')
