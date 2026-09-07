"""Build client/src/data/ibpspo-pyq.json from the careerpower prelims PDFs."""
import json, re, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from parse_pyq import linear_text, split_qa, parse_questions, parse_solutions, clean
from chart_data import CHARTS

P = 'client/src/data/pyq-source/'
# The index is imported statically and holds metadata only — enough to render
# the paper cards. Each paper's questions live in their own file under PAPER_DIR
# and are fetched on demand, so opening the tab no longer drags ~1.3MB of
# questions into the route chunk.
OUT = 'client/src/data/ibpspo-pyq.json'
PAPER_DIR = 'client/src/data/pyq/'

PAPERS = [
    ('ibpspo-2025-prelims-s1', 'IBPS PO Prelims 2025 — Shift 1', '2025', 'Shift 1 · 23 Aug 2025', 'prelims-2025-shift1.pdf', None),
    ('ibpspo-2025-prelims-s2', 'IBPS PO Prelims 2025 — Shift 2', '2025', 'Shift 2 · 23 Aug 2025', 'prelims-2025-shift2.pdf', None),
    ('ibpspo-2024-prelims',    'IBPS PO Prelims 2024',           '2024', 'Memory-based reconstruction', 'prelims-2024.pdf', None),
    ('ibpspo-2023-prelims',    'IBPS PO Prelims 2023',           '2023', 'Memory-based reconstruction', 'prelims-2023.pdf', None),
    ('ibpspo-2022-prelims',    'IBPS PO Prelims 2022',           '2022', 'Memory-based reconstruction', 'prelims-2022.pdf', None),
    ('ibpspo-2021-prelims',    'IBPS PO Prelims 2021',           '2021', 'Based on 4 Dec 2021',        'prelims-2021.pdf', 'prelims-2021-solutions.pdf'),
    ('ibpspo-2020-prelims',    'IBPS PO Prelims 2020',           '2020', 'Memory-based reconstruction', 'prelims-2020.pdf', 'prelims-2020-solutions.pdf'),
]

# 2016–2019 are published one subject at a time, and each subject file carries
# its OWN numbering (2017 has an English Q1-30 and a Reasoning Q1-35), so they
# are parsed per subject and renumbered into a single 100-question paper.
# 2016 is absent on purpose: those scans have no text layer at all — 0 options
# and 0 questions come back — so they would need OCR, not parsing.
SPLIT_PAPERS = [
    ('ibpspo-2019-prelims', 'IBPS PO Prelims 2019', '2019', 'Memory-based reconstruction'),
    ('ibpspo-2018-prelims', 'IBPS PO Prelims 2018', '2018', 'Memory-based reconstruction'),
    ('ibpspo-2017-prelims', 'IBPS PO Prelims 2017', '2017', 'Memory-based reconstruction'),
]
SUBJECT_FILE = {'English Language': 'english', 'Quantitative Aptitude': 'quant', 'Reasoning Ability': 'reasoning'}

# SBI PO, not IBPS — same 100/60-minute prelims shape and the same three
# sections, but a different exam, so the names say so plainly rather than
# letting anyone assume these are IBPS papers. This source also prints the
# answer INLINE after each question ("Ans.(e)") instead of collecting solutions
# at the back, which needs the inline parse path.
INLINE_PAPERS = [
    ('sbipo-2026-prelims-aug01', 'SBI PO Prelims 2026 — 1 Aug (Shift 1)', '2026',
     'Memory-based · 1 Aug 2026', 'sbipo-2026-aug01-s1.pdf'),
    ('sbipo-2026-prelims-aug02', 'SBI PO Prelims 2026 — 2 Aug (Shift 1)', '2026',
     'Memory-based · 2 Aug 2026', 'sbipo-2026-aug02-s1.pdf'),
]

RRB_PAPERS = [
    ('rrbpo-2025-nov23', 'IBPS RRB PO Prelims 2025 — 23 Nov (Shift 1)', '2025', 'Memory-based · 23 Nov 2025', 'rrbpo-2025-nov23-s1.pdf'),
    ('rrbpo-2025-nov22', 'IBPS RRB PO Prelims 2025 — 22 Nov (Shift 1)', '2025', 'Memory-based · 22 Nov 2025', 'rrbpo-2025-nov22-s1.pdf'),
    ('rrbpo-2024-aug04', 'IBPS RRB PO Prelims 2024 — 4 Aug',            '2024', 'Memory-based · 4 Aug 2024',  'rrbpo-2024-aug04.pdf'),
    ('rrbpo-2024-aug03', 'IBPS RRB PO Prelims 2024 — 3 Aug (Shift 1)',  '2024', 'Memory-based · 3 Aug 2024',  'rrbpo-2024-aug03-s1.pdf'),
    ('rrbpo-2023',       'IBPS RRB PO Prelims 2023',                    '2023', 'Memory-based reconstruction', 'rrbpo-2023.pdf'),
    ('rrbpo-2022',       'IBPS RRB PO Prelims 2022',                    '2022', 'Memory-based reconstruction', 'rrbpo-2022.pdf'),
    ('rrbpo-2021',       'IBPS RRB PO Prelims 2021',                    '2021', 'Memory-based reconstruction', 'rrbpo-2021.pdf'),
    ('rrbpo-2020',       'IBPS RRB PO Prelims 2020',                    '2020', 'Memory-based · partial paper', 'rrbpo-2020.pdf'),
]
# 2017-2019 are scans with no text layer — 0 questions parse, they would need OCR.

SECTIONS = [('English Language', 30), ('Quantitative Aptitude', 35), ('Reasoning Ability', 35)]

# IBPS RRB PO Officer Scale I prelims is a DIFFERENT shape: two sections of 40,
# no English at all. Assigning it with the IBPS 30/35/35 blueprint would invent
# an English block that does not exist in the paper.
RRB_SECTIONS = [('Reasoning Ability', 40), ('Quantitative Aptitude', 40)]

CUES = {
    'English Language': r'passage|sentence|grammatic|synonym|antonym|idiom|phrase|paragraph|blank|error|vocabul|rearrange|comprehension|contextual|no correction|meaningful word|bold',
    'Quantitative Aptitude': r'\bratio\b|percent|profit|loss|\binterest\b|average|speed|litre|liter|\bcm\b|\bkm\b|Rs\.?|series|equation|quantity|approximate|invested|discount|marked price|downstream|upstream|[xy]2|\d+\s*%|find the value',
    'Reasoning Ability': r'\bsits?\b|seating|arrangement|syllogism|statements?:|conclusions?:|blood relation|coding|decoding|puzzle|\bfaces?\b|immediate(ly)? (left|right|above|below)|north|south|east|west|alphabet|\bfloor\b|\bbox(es)?\b|lives? (in|on|with)|how many persons',
}

TOPIC_RULES = [
    ('Reading Comprehension', r'passage'),
    ('Para Jumbles',          r'rearrange'),
    ('Error Spotting',        r'grammatical or idiomatic error|no error'),
    ('Phrase Replacement',    r'replace the phrase|no correction required'),
    ('Word Swap',             r'correct combination of words|interchange'),
    ('Double Fillers',        r'two blanks'),
    ('Cloze Test',            r'cloze'),
    ('Number Series',         r'question \(\?\) mark|number series|place of question'),
    ('Quadratic Equations',   r'two equation|equations? \(i\)'),
    ('Data Interpretation',   r'pie chart|bar graph|line graph|table shows|given below shows|caselet'),
    ('Approximation',         r'approximate value'),
    ('Syllogism',             r'statements:.*conclusions:'),
    ('Inequalities',          r'≤|≥|relationship between different elements'),
    ('Seating Arrangement',   r'sit around|seating|row fac'),
    ('Puzzle',                r'boxes|persons.*different (states|cities|months)'),
    ('Direction Sense',       r'\bm to the (west|east|north|south)\b'),
    ('Coding-Decoding',       r'code language'),
    ('Blood Relation',        r'blood relation|father|mother of'),
]

# Questions whose data lives in an image (pie/bar/line charts) cannot be answered
# from the text alone, so they are flagged rather than silently shipped broken.
CHART = r'pie chart|bar graph|line graph|bar chart|radar|given below shows the percentage'


def assign_sections(qs, sections=None):
    """IBPS prelims is 30/35/35 in contiguous blocks, but the block ORDER varies
    by paper. Score every permutation against per-section vocabulary and keep
    the best-fitting one rather than assuming English comes first."""
    from itertools import permutations
    sections = sections or SECTIONS
    text = {n: (qs[n]['directions'] or '') + ' ' + qs[n]['stem'] + ' ' + ' '.join(qs[n]['options'].values())
            for n in qs}
    # One VOTE per question for its own best-matching section. Summing raw cue
    # hits instead let a few long puzzle stems outweigh 30 short ones and put
    # 2022's blocks in the wrong order.
    vote = {}
    for n, t in text.items():
        hits = {s: len(re.findall(p, t, re.I)) for s, p in CUES.items()}
        top = max(hits.values())
        vote[n] = max(hits, key=hits.get) if top else None
    best = None
    for perm in permutations(sections):
        assign, i = {}, 1
        for name, cnt in perm:
            for n in range(i, i + cnt):
                assign[n] = name
            i += cnt
        score = sum(1 for n in assign if vote.get(n) == assign[n])
        if best is None or score > best[0]:
            best = (score, assign)
    return best[1]


def topic_for(text, section):
    for name, pat in TOPIC_RULES:
        if re.search(pat, text, re.I | re.S):
            return name
    return {'English Language': 'English Language',
            'Quantitative Aptitude': 'Arithmetic',
            'Reasoning Ability': 'Reasoning'}[section]


def build(pid, name, year, shift, qpdf, spdf):
    qtext = linear_text(P + qpdf)
    sregion = linear_text(P + spdf) if spdf else split_qa(qtext)[1]
    qs, ss = parse_questions(qtext), parse_solutions(sregion)
    sec = assign_sections(qs)

    # Sitting the paper one question at a time, an unspread Directions block left
    # every question after the first in an RC or DI set with no passage on screen.
    qs = spread_directions(qs)
    return emit(qs, ss, sec, year, pid)


def spread_directions(qs):
    """A "Directions (41-45):" block governs its whole range, but the parser can
    only attach it to the question it precedes."""
    spread = {}
    for n in sorted(qs):
        d = qs[n]['directions']
        if not d:
            continue
        m = re.match(r'Directions?\s*\(\s*(\d+)\s*(?:[–\-—]\s*(\d+))?\s*\)', d)
        lo = int(m.group(1)) if m else n
        hi = int(m.group(2)) if (m and m.group(2)) else lo
        for k in range(min(lo, n), max(hi, n) + 1):
            spread.setdefault(k, d)
    for n in qs:
        qs[n]['directions'] = spread.get(n) or qs[n]['directions']
    return qs


def build_inline(pid, qpdf):
    """Papers whose answers sit inline after each question rather than at the back."""
    from parse_pyq import parse_inline_answers, strip_inline_answers
    raw = linear_text(P + qpdf)
    answers = parse_inline_answers(raw)
    qs = spread_directions(parse_questions(strip_inline_answers(raw)))
    ss = {n: {'ans': a, 'sol': ''} for n, a in answers.items()}
    return emit(qs, ss, assign_sections(qs), '2026', pid)


def build_rrb(pid, qpdf, year):
    """IBPS RRB PO prelims — two sections of 40, no English."""
    qtext = linear_text(P + qpdf)
    qs = spread_directions(parse_questions(qtext))
    ss = parse_solutions(split_qa(qtext)[1])
    return emit(qs, ss, assign_sections(qs, RRB_SECTIONS), year, pid)


def build_split(year, pid=None):
    """2016-2019 ship one PDF per subject, each with its own Q1..Qn numbering,
    so the subject is known from the FILE and no detection is needed. Questions
    are renumbered into a single 1-100 paper in official section order."""
    qs, ss, sec, seq = {}, {}, {}, 0
    for section, _ in SECTIONS:
        tag = SUBJECT_FILE[section]
        try:
            sub_q = spread_directions(parse_questions(linear_text(f'{P}p{year}-{tag}.pdf')))
            sub_s = parse_solutions(linear_text(f'{P}s{year}-{tag}.pdf'))
        except FileNotFoundError:
            continue
        for orig in sorted(sub_q):
            seq += 1
            qs[seq], ss[seq], sec[seq] = sub_q[orig], sub_s.get(orig, {}), section
    return emit(qs, ss, sec, str(year), pid)


def chart_for(pid, n):
    """The recovered chart governing question n of this paper, if any.

    Each entry declares `span` — how many consecutive questions the set covers —
    so the match is exact rather than inferred from a guessed window.
    """
    for (cid, q0), entry in CHARTS.items():
        if cid == pid and q0 <= n < q0 + entry["span"]:
            return entry
    return None


def emit(qs, ss, sec, year, pid=None):
    out, flagged, unanswerable = [], 0, []
    for n in sorted(qs):
        q = qs.get(n)
        if not q or len(q['options']) < 2:
            continue
        d = q['directions'] or ''
        blob = d + ' ' + q['stem']
        needs_chart = bool(re.search(CHART, d, re.I))
        # A hand-recovered chart (chart_data.py, verified by verify_charts.py)
        # replaces the warning with the real table, making the set solvable.
        recovered = chart_for(pid, n)
        if needs_chart and not recovered:
            flagged += 1
        # Some questions genuinely have no stem — "choose the correct sentence"
        # and cloze-blank sets ARE just their options, with the instruction in
        # the directions block. Others lost their stem because the source
        # printed it as an image; those are called out rather than left blank.
        stem = q['stem'].strip()
        if not stem:
            if sec[n] == 'English Language':
                stem = f'Choose the correct option for ({n}) — see the directions above.'
                lost = False
            else:
                stem = (f'⚠️ The expression for Q{n} is printed as an image in the source paper '
                        f'and could not be extracted, so this question cannot be solved as shown.')
                lost = True
        else:
            lost = False
        # Options can be images too — a stem survives but its choices come back
        # empty or as bare "(b)" fragments. Same treatment: say so on the card
        # rather than presenting a question that cannot be answered.
        opts = {L: q['options'].get(L, '') for L in 'ABCDE' if L in q['options']}
        if len(opts) < 5 or any(not v or re.fullmatch(r'\(?[a-e]\)?', v) for v in opts.values()):
            if not lost:
                stem = ('⚠️ Some options for this question are printed as images in the source paper '
                        'and could not be extracted.\n\n' + stem)
                lost = True
        if lost:
            unanswerable.append(n)
        item = {
            'id': f'{year}-q{n}',
            'section': sec[n],
            'topic': topic_for(blob, sec[n]),
            'question': stem,
            'options': {L: q['options'].get(L, '') for L in 'ABCDE' if L in q['options']},
            'correctAnswer': ss.get(n, {}).get('ans'),
        }
        if recovered:
            # The chart is gone, but its numbers are back — hand the set a real
            # table and say where it came from, since it is a reconstruction.
            item['table'] = {'columns': recovered['columns'], 'rows': recovered['rows']}
            item['passage'] = (d + '\n\n📊 ' + recovered['note'] +
                               '\n(The original chart is an image in the source paper; these values were '
                               'recovered from its own worked solutions and verified against them.)')
        elif d:
            item['passage'] = d + ('\n\n⚠️ This set is based on a chart printed as an image in the source paper; '
                                   'the chart data is not included here.' if needs_chart else '')
        sol = ss.get(n, {}).get('sol', '')
        if sol:
            item['explanation'] = sol[:1200]
        # A question with no key, or whose key points at an option that did not
        # survive extraction, would score every attempt wrong. Drop it and let
        # the paper run short — the exam engine handles partial papers.
        if item['correctAnswer'] and item['correctAnswer'] in item['options']:
            out.append(item)
    return out, flagged, unanswerable


def main():
    doc = json.load(open(OUT))
    papers = []
    jobs = ([(p, lambda p=p: build(*p)) for p in PAPERS] +
            [((pid, name, year, shift), lambda y=year, i=pid: build_split(int(y), i))
             for pid, name, year, shift in SPLIT_PAPERS] +
            [((pid, name, year, shift), lambda i=pid, f=qpdf: build_inline(i, f))
             for pid, name, year, shift, qpdf in INLINE_PAPERS] +
            [((pid, name, year, shift), lambda i=pid, f=qpdf, y=year: build_rrb(i, f, y))
             for pid, name, year, shift, qpdf in RRB_PAPERS])
    for meta, run in jobs:
        pid, name, year, shift = meta[0], meta[1], meta[2], meta[3]
        qlist, flagged, unans = run()
        nokey = [q['id'] for q in qlist if not q['correctAnswer']]
        counts = {}
        for q in qlist:
            counts[q['section']] = counts.get(q['section'], 0) + 1
        # Which exam this paper belongs to. RRB PO runs a different profile —
        # two sections of 40, unequal 25/20 windows, flat 1 mark — so the exam
        # engine must not assume the IBPS shape.
        papers.append({
            'id': pid, 'name': name, 'year': year, 'shift': shift,
            'exam': 'rrb' if pid.startswith('rrbpo') else 'ibps',
            'source': 'memory-based',
            'note': ("Compiled from careerpower.in's memory-based paper — IBPS never released the original. "
                     "Answer keys and worked solutions are the source's own."
                     + (f' {flagged} chart-based questions are marked — their charts are images in the source.' if flagged else '')),
            'total': len(qlist),
            # Section order preserved as printed in the paper; the exam engine
            # re-sorts into official order when the attempt starts.
            'sections': [{'name': s, 'count': c} for s, c in counts.items()],
        })
        os.makedirs(PAPER_DIR, exist_ok=True)
        with open(f'{PAPER_DIR}{pid}.json', 'w') as fh:
            json.dump({'id': pid, 'questions': qlist}, fh, ensure_ascii=False, indent=1)
        print(f'{name:34} {len(qlist):3} Qs  keyless={len(nokey):2}  chart-flagged={flagged:2}  '
              f'unanswerable={len(unans)} {unans if unans else ""}')
    doc['papers'] = papers
    json.dump(doc, open(OUT, 'w'), ensure_ascii=False, indent=1)
    idx_kb = os.path.getsize(OUT) / 1024
    tot_kb = sum(os.path.getsize(f'{PAPER_DIR}{p["id"]}.json') for p in papers) / 1024
    print(f'\nindex  {OUT}  {idx_kb:.0f} KB ({len(papers)} papers, metadata only)')
    print(f'papers {PAPER_DIR}*.json  {tot_kb:.0f} KB total, loaded on demand')


if __name__ == '__main__':
    main()
