import random
import re
import httpx
from datetime import datetime, timezone, timedelta, date
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from bson import ObjectId
from deps import current_user, require_ai_enabled
from utils.ai import _groq_call, _ollama_text_action, GROQ_MODEL, GROQ_API_KEY
from db_mongo import (
    col_streaks, col_progress, col_study_reviewed, col_weak_area_insights,
    col_voice_transcripts, col_mock_tests, now, sid, oid
)

router = APIRouter()


# ── AI helper ─────────────────────────────────────────────────────────────────

async def _groq_plain(system: str, user: str, max_tokens: int = 500) -> str:
    r = await _groq_call({
        "messages": [
            {"role": "system", "content": system},
            {"role": "user",   "content": user},
        ],
        "temperature": 0.5,
        "max_tokens": max_tokens,
    })
    return r.json()["choices"][0]["message"]["content"].strip()


# ── Summarise ──────────────────────────────────────────────────────────────────

class SummariseReq(BaseModel):
    title: str
    topic: str
    summary: str
    explanation: str
    code: str | None = None
    category: str | None = None


@router.post("/summarise")
async def ai_summarise(req: SummariseReq, _=Depends(require_ai_enabled)):
    if req.category and "ibpspo" in req.category:
        system = (
            "You are an expert IBPS PO Exam preparation coach. "
            "Give a concise, clear summary of the banking concept, aptitude trick, or reasoning topic for an aspirant. "
            "Use clear language. Keep it under 120 words. No markdown, no bullet points."
        )
    else:
        system = (
            "You are a senior developer mentor. "
            "Give a concise, clear summary of the given topic for a developer preparing for interviews. "
            "Use plain English. Keep it under 120 words. No markdown, no bullet points."
        )
    user = (
        f"Topic: {req.topic} — {req.title}\n\n"
        f"Key concept: {req.summary}\n\n"
        f"Explanation: {req.explanation}\n\n"
        + (f"Code context:\n{req.code}" if req.code else "")
        + "\n\nSummarise this clearly for interview revision."
    )
    try:
        text = await _groq_plain(system, user, 300)
    except Exception:
        try:
            text = await _ollama_text_action(user)
        except Exception:
            text = req.summary
    return {"summary": text}


# ── Ask AI ────────────────────────────────────────────────────────────────────

class AskReq(BaseModel):
    title: str
    topic: str
    explanation: str
    code: str | None = None
    question: str
    category: str | None = None


@router.post("/ask")
async def ai_ask(req: AskReq, _=Depends(require_ai_enabled)):
    if req.category and "ibpspo" in req.category:
        system = (
            "You are an expert IBPS PO Exam preparation coach. Answer the banking, aptitude, or reasoning question. "
            "Be concise, accurate, and provide step-by-step logic if explaining math/reasoning. Max 200 words. "
            "No markdown headers. Use clear English."
        )
    else:
        system = (
            "You are a senior developer mentor answering developer interview questions. "
            "Be concise, accurate, and practical. Max 200 words. No markdown headers. "
            "Use plain English. You may use short code examples inline."
        )
    user = (
        f"Topic context: {req.topic} — {req.title}\n"
        f"Explanation: {req.explanation}\n"
        + (f"Code: {req.code}\n" if req.code else "")
        + f"\nDeveloper's question: {req.question}\n\nAnswer concisely."
    )
    try:
        text = await _groq_plain(system, user, 400)
    except Exception:
        try:
            text = await _ollama_text_action(user)
        except Exception:
            text = "Sorry, AI is unavailable right now. Please try again."
    return {"answer": text}


# ── Interview Review ──────────────────────────────────────────────────────────

class InterviewReviewReq(BaseModel):
    question: str
    modelAnswer: str
    userAnswer: str


@router.post("/ibps-po/review-interview")
async def review_ibpspo_interview(req: InterviewReviewReq, _=Depends(require_ai_enabled)):
    if not req.userAnswer.strip():
        return {"feedback": "Please type an answer to be reviewed.", "score": 0, "improvements": ""}
    
    system = (
        "You are an expert IBPS PO Interview Panelist. "
        "Analyze the candidate's answer for the given question, compare it with the model answer, and provide constructive feedback. "
        "Keep it concise. Respond in this EXACT JSON format:\n"
        '{"feedback": "2-3 sentences of feedback highlighting strengths and weaknesses", '
        '"score": 7, '
        '"improvements": "1-2 bullet points or suggestions for improvement"}\n'
        "Rules:\n"
        "- score: An integer from 1 to 10 rating the answer.\n"
        "- Respond ONLY with valid JSON. No markdown, no extra text."
    )
    user = (
        f"Question: {req.question}\n"
        f"Model Answer: {req.modelAnswer}\n"
        f"Candidate's Answer: {req.userAnswer}"
    )
    import json as _json
    try:
        raw = await _groq_plain(system, user, 500)
        start = raw.find("{")
        end   = raw.rfind("}") + 1
        data  = _json.loads(raw[start:end]) if start != -1 else {}
        return data
    except Exception:
        return {
            "feedback": "AI is unavailable right now to review your answer.",
            "score": 0,
            "improvements": "Please check your network and try again."
        }



class GenerateMockReq(BaseModel):
    # Full IBPS PO Prelims pattern by default. A smaller count still produces a
    # correctly proportioned paper rather than a run of one section.
    count: int = 100
    # Restrict the paper to ONE section, for a 20-minute single-section drill —
    # a full 60-minute sitting is not something you can fit into a lunch break.
    # None (the default) keeps the full three-section pattern.
    section: str | None = None


# Official IBPS PO Prelims 2026 pattern: 100 questions / 100 marks / 60 minutes,
# with 20 minutes of sectional timing each.
#   name -> (questions, section marks, marks per question, negative per question)
IBPS_SECTION_PLAN = [
    ("English Language",      30, 30, 1.0,  -0.25),
    ("Quantitative Aptitude", 35, 30, 0.86, -0.215),
    ("Reasoning Ability",     35, 40, 1.14, -0.285),
]

# Topic rotation per section. Each AI call is given ONE focus area, which is what
# actually stops the model collapsing into a single templated stem repeated N times.
IBPS_TOPIC_POOL = {
    "English Language": [
        "Reading Comprehension (one passage, each question on a different aspect)",
        "Cloze Test with contextual blanks",
        "Error Spotting on subject-verb agreement, prepositions and parallelism",
        "Para Jumble and sentence rearrangement",
        "Sentence Improvement and phrase replacement",
        "Single and double Fillers, plus Word Swap",
    ],
    "Quantitative Aptitude": [
        "Approximation and Simplification",
        "Quadratic Equation comparison of x and y",
        "Number Series, both missing term and wrong term",
        "Table or Pie chart Data Interpretation with a shared data set",
        "Arithmetic: percentage, profit and loss, simple and compound interest",
        "Arithmetic: time and work, time-speed-distance, boats, pipes, mixtures",
    ],
    # PO-level Reasoning is the hardest section of the paper: a puzzle carries
    # TWO or THREE variables at once (person + floor + colour, not just seats),
    # and a set is solved as one grid rather than question by question. Asking
    # for "a linear seating arrangement" produced 5-person, one-variable sets
    # that sit well below the real paper.
    "Reasoning Ability": [
        "Linear seating: 8 persons in two parallel rows facing each other, plus a second variable",
        "Circular or square seating: 8 persons, mixed facing (some inward, some outward), plus one attribute",
        "Floor-and-flat puzzle: 7-8 persons across floors with a second variable such as colour or salary",
        "Month/date scheduling puzzle: 8 persons across months and two dates each",
        "Syllogism with 'Only a few', possibility conclusions and the either-or case",
        "Coded inequalities, coded blood relations, and direction sense with a distance calculation",
    ],
}


def _normalise_stem(text: str) -> str:
    """Collapse a question to a comparable form.

    The previous implementation compared raw stems, so a model that emitted the
    same question ten times with '(Question 1)'..'(Question 10)' appended slipped
    through as ten distinct items. Stripping that suffix and all punctuation is
    what actually catches it.
    """
    import re as _re
    t = _re.sub(r"\s*\((?:Question|Scenario|Set|Q)\s*\d+\)\s*$", "", text or "", flags=_re.I)
    t = _re.sub(r"[^a-z0-9]+", " ", t.lower())
    return t.strip()


def _option_signature(q: dict) -> str:
    opts = q.get("options") or {}
    return "|".join(sorted(str(v).strip().lower() for v in opts.values() if v))


_EXPR_OK = re.compile(r"^[\d\s+\-*/×÷^().%]+$")
# √ appears constantly in Approximation. It is rewritten to **0.5 before parsing
# so the same AST walker handles it, rather than allowing function calls.
_SQRT_CALL = re.compile(r"(?:√|sqrt)\s*\(([^()]*)\)", re.I)
_SQRT_BARE = re.compile(r"(?:√|sqrt)\s*(\d+(?:\.\d+)?)", re.I)
# Powers appear constantly in Approximation ("the value of (2.001)^4"), so the
# evaluator must understand them — but an unbounded exponent from model output
# is a denial-of-service waiting to happen, so bound both operands. 20 is an
# ordinary compound-interest exponent, so a cap of 12 silently skipped real
# questions; the base bound is what actually keeps the work small.
_MAX_EXPONENT = 64
_MAX_POW_BASE = 10 ** 6


def _eval_arithmetic(expr: str):
    """Value of a plain arithmetic expression, or None if it is not one.

    Evaluated through the AST with only numbers and the four operators allowed —
    never eval() on model output.
    """
    import ast as _ast
    from decimal import Decimal as _D

    e = (expr or "").replace("×", "*").replace("÷", "/").strip().rstrip("=?. ")
    # Rewrite roots first — √(81.6) and √81.6 both become (81.6)**0.5 — so the
    # character whitelist below never has to admit √ itself.
    e = _SQRT_CALL.sub(r"((\1)**0.5)", e)
    e = _SQRT_BARE.sub(r"((\1)**0.5)", e)
    if not e or not _EXPR_OK.match(e) or not re.search(r"[+\-*/^]|\*\*", e):
        return None
    e = e.replace("^", "**")   # exam notation -> Python
    try:
        node = _ast.parse(e, mode="eval").body
    except SyntaxError:
        return None

    def walk(n):
        if isinstance(n, _ast.Constant) and isinstance(n.value, (int, float)):
            return _D(str(n.value))
        if isinstance(n, _ast.UnaryOp) and isinstance(n.op, (_ast.UAdd, _ast.USub)):
            v = walk(n.operand)
            return v if isinstance(n.op, _ast.UAdd) else -v
        if isinstance(n, _ast.BinOp):
            a, b = walk(n.left), walk(n.right)
            if isinstance(n.op, _ast.Add):
                return a + b
            if isinstance(n.op, _ast.Sub):
                return a - b
            if isinstance(n.op, _ast.Mult):
                return a * b
            if isinstance(n.op, _ast.Div):
                return a / b if b != 0 else None
            if isinstance(n.op, _ast.Pow):
                if not (0 <= b <= _MAX_EXPONENT) or abs(a) > _MAX_POW_BASE:
                    raise ValueError("power out of range")
                if b == _D("0.5"):                       # from a rewritten √
                    return a.sqrt() if a >= 0 else None
                if b != b.to_integral_value():
                    raise ValueError("non-integer exponent")
                return a ** int(b)
        raise ValueError("unsupported")

    try:
        return walk(node)
    except Exception:                                    # noqa: BLE001
        return None


def _arithmetic_answer_is_wrong(q: dict) -> bool:
    """True when a stem states a plain sum whose real value contradicts the key.

    "The value of 0.999 + 0.0009 is closest to" came back with the sum worked as
    1.0009 (it is 0.9999) and the key pointing at 1.001, so a candidate choosing
    the correct option was marked wrong. Whenever the stem contains an expression
    we can evaluate ourselves and the options are numeric, the model's answer is
    checkable rather than trusted.
    """
    from decimal import Decimal as _D, InvalidOperation as _Inv

    # √ and "sqrt" must be inside the captured class or "value of √(81.6)"
    # captures nothing and the question sails through unchecked.
    m = re.search(r"(?:value of|simplify|solve|find)\s*[:\-]?\s*((?:√|sqrt|[\d\s+\-*/×÷^().])+)",
                  q.get("question", ""), re.I)
    if not m:
        return False
    val = _eval_arithmetic(m.group(1))
    if val is None:
        return False

    nums = {}
    for k, v in (q.get("options") or {}).items():
        t = re.sub(r"[^\d.\-]", "", str(v))
        try:
            nums[k] = _D(t)
        except (_Inv, ValueError):
            return False                                  # non-numeric options: cannot judge
    if len(nums) < 5:
        return False
    closest = min(nums, key=lambda k: abs(val - nums[k]))

    # Even the nearest option can be nowhere near the answer — "(1.01)^20"
    # (= 1.22) shipped with options clustered at 2.08-2.2, every one of them
    # ~70% out. The key is then irrelevant: the option set belongs to a
    # different question, so the whole item is unusable.
    gap = abs(val - nums[closest])
    scale = max(abs(val), _D("1"))
    if gap / scale > _D("0.2"):
        return True

    return q.get("correctAnswer") != closest


# The model sometimes works a question out, notices its answer is not among the
# options, and says so in the explanation instead of fixing the question — e.g.
# "However, this is not an option. We made a mistake in our calculation. The
# correct difference is 1200, but we wrote 3600 as the correct answer." That
# confession is a precise, cheap signal for a broken item, and unlike the
# arithmetic checker it works on word problems too.
_SELF_CONTRADICTION = re.compile(
    r"not\s+(?:an\s+)?option"
    r"|made\s+a\s+mistake"
    r"|(?:we|i)\s+(?:wrongly|incorrectly|mistakenly)"
    r"|but\s+we\s+wrote"
    r"|none\s+of\s+the\s+(?:given\s+)?options?\s+match"
    r"|option\s+is\s+(?:in)?correct.{0,20}however"
    r"|there\s+(?:is|seems to be)\s+(?:an?\s+)?(?:error|mistake)"
    r"|question\s+(?:is|seems|appears)\s+(?:to\s+be\s+)?(?:incorrect|wrong|flawed)",
    re.I,
)


def _explanation_admits_error(q: dict) -> bool:
    return bool(_SELF_CONTRADICTION.search(q.get("explanation") or ""))


# "sqrt(9^2 + 3^2) = sqrt(90) = 9.49, which is approximately 7.05 km" — the
# working is right, the stated answer is not. Catching this needs no
# understanding of the question: whatever the explanation COMPUTES has to match
# the option that was keyed.
_COMPUTED = re.compile(r"=\s*(-?\d+(?:\.\d+)?)\s*(?:,|\.|\s|$)")


def _explanation_contradicts_key(q: dict) -> bool:
    expl = q.get("explanation") or ""
    opts = q.get("options") or {}
    key = q.get("correctAnswer")
    if key not in opts:
        return False
    keyed = re.sub(r"[^\d.\-]", "", str(opts[key]))
    if not re.fullmatch(r"-?\d+(\.\d+)?", keyed or ""):
        return False                                  # non-numeric option: cannot judge
    values = [v for v in _COMPUTED.findall(expl)]
    if not values:
        return False
    from decimal import Decimal as _D, InvalidOperation as _Inv
    try:
        target = _D(keyed)
        nums = [_D(v) for v in values]
    except (_Inv, ValueError):
        return False
    # The keyed value must appear among the computed results, or be within 2% of
    # the LAST one (a legitimate rounding step). Otherwise the explanation is
    # arriving at one number and the key is claiming another.
    if any(abs(n - target) <= abs(target) * _D("0.02") for n in nums):
        return False
    last = nums[-1]
    return not (last == 0 and target == 0)


def _load_fallback_bank() -> list:
    import json as _json
    import os as _os
    p = "client/src/data/ibpspo-mock-test.json"
    if not _os.path.exists(p):
        p = _os.path.join(_os.path.dirname(__file__), "..", "..", "client", "src", "data", "ibpspo-mock-test.json")
    with open(p, "r") as f:
        return _json.load(f).get("questions", [])


@router.post("/ibps-po/generate-mock")
async def generate_ibpspo_mock(req: GenerateMockReq, _=Depends(require_ai_enabled)):
    """Build a full-pattern mock paper.

    Generation is split into one call per (section, topic) chunk and run
    concurrently. A single large call was the root cause of repeated questions:
    asked for 15 items at once the model padded the tail by re-emitting earlier
    stems with a '(Question N)' suffix.
    """
    import asyncio as _asyncio
    import json as _json

    total = max(1, min(req.count, 100))

    # A single-section request keeps that section's OWN full question count
    # rather than scaling it down — an English drill is 30 questions in 20
    # minutes, exactly as it is inside the full paper, so the pacing a candidate
    # practises is the pacing they will sit.
    plan = IBPS_SECTION_PLAN
    if req.section:
        plan = [s for s in IBPS_SECTION_PLAN if s[0] == req.section]
        if not plan:
            raise HTTPException(400, f"Unknown section '{req.section}'")

    section_targets = []
    if req.section:
        name, qcount, _sm, per, neg = plan[0]
        section_targets.append((name, min(total, qcount) if req.count != 100 else qcount, per, neg))
    else:
        scale = total / 100.0
        for name, qcount, _sm, per, neg in plan:
            n = max(1, round(qcount * scale))
            section_targets.append((name, n, per, neg))

    system = (
        "You are an expert IBPS PO paper setter. Output ONLY a raw JSON array — no prose, no markdown fences.\n"
        "Each element must match this schema exactly:\n"
        "{\n"
        '  "topic": "string",\n'
        '  "difficulty": "Easy | Moderate | Hard",\n'
        '  "question": "string",\n'
        '  "passage": "string or null",\n'
        '  "table": {"columns": ["..."], "rows": [["..."]]} or null,\n'
        '  "options": {"A": "...", "B": "...", "C": "...", "D": "...", "E": "..."},\n'
        '  "correctAnswer": "A | B | C | D | E",\n'
        '  "explanation": "string — full working, not just the answer",\n'
        '  "shortcut": "string"\n'
        "}\n"
        "HARD RULES:\n"
        "1. Never append '(Question N)', '(Set N)' or any similar counter to a question. "
        "Every stem must stand alone and differ substantively from the others.\n"
        "2. Never reuse a stem, a scenario, a number set or an option list across questions.\n"
        "3. If several questions share one passage or data table, put the full text in 'passage' "
        "(or 'table') on the FIRST question only and set it to null on the rest, and make each "
        "question ask about a genuinely different aspect.\n"
        "4. correctAnswer must be a key that exists in options, and the correct option must not "
        "always be the same letter across the set.\n"
        "5. Every question must be solvable purely from what you provide, and the explanation must "
        "actually derive the stated answer.\n"
        "6. SOLVE each question before you write its options. Work the arithmetic through, then "
        "make the computed value one of the five options and point correctAnswer at it. A question "
        "whose worked answer is not among its own options is worthless — reject and rewrite it.\n"
        "7. State EVERY quantity the question needs. A rate with no principal, a ratio with no "
        "total, a percentage with no base — these are unanswerable. Re-read your stem and confirm "
        "each number the explanation uses actually appears in it.\n"
        "8. All five options must be distinct, plausible and in the same unit and magnitude as the "
        "answer. Never mix, say, 35% with a set of options clustered at 5-20%.\n"
        "9. DIFFICULTY FLOOR — this is an SBI/IBPS PO paper, not a school test. Every question must "
        "take a prepared candidate 45-90 seconds and at least THREE chained steps. Concretely:\n"
        "   • Arithmetic: never a single formula. 'Find 20% of 400' or 'find the SI on 5000 at 8% for "
        "5 years' are far below the bar. Instead: a marked price WITH a discount AND a markup; a ratio "
        "some years ago PLUS a relation to a third person; successive percentage deductions where each "
        "applies to what remains.\n"
        "   • Reasoning: a puzzle must carry TWO or THREE variables at once (person + floor + colour), "
        "with 7-8 entities, and the clues must require elimination rather than direct reading. A "
        "5-person single-variable arrangement is too easy.\n"
        "   • English: an RC question must need inference across sentences, not a phrase lookup.\n"
        "   Mark 'difficulty' honestly as Moderate or Hard — if a question is genuinely Easy by PO "
        "standards, do not produce it at all.\n"
        "10. Return valid JSON and nothing else."
    )

    async def _chunk(section: str, topic_focus: str, n: int) -> list:
        user = (
            f"Generate exactly {n} IBPS PO Prelims questions for the section '{section}'.\n"
            f"Focus area for this batch: {topic_focus}.\n"
            "Match genuine IBPS PO Prelims difficulty and phrasing. "
            "Verify each answer before returning it."
        )
        try:
            raw = await _groq_plain(system, user, 3000)
            s, e = raw.find("["), raw.rfind("]") + 1
            if s == -1 or e <= s:
                return []
            items = _json.loads(raw[s:e])
            return [i for i in items if isinstance(i, dict)]
        except Exception:
            return []   # one bad batch must not lose the whole paper

    # Build the batch list: split each section across its topic pool.
    jobs = []
    for section, n, _per, _neg in section_targets:
        pool = IBPS_TOPIC_POOL[section]
        # ~6 questions per call keeps output quality high and stays inside the token budget
        batches = max(1, min(len(pool), (n + 5) // 6))
        base, extra = divmod(n, batches)
        for b in range(batches):
            size = base + (1 if b < extra else 0)
            if size:
                jobs.append((section, pool[b % len(pool)], size))

    results = await _asyncio.gather(*[_chunk(s, t, n) for s, t, n in jobs])

    # Collect per section, rejecting duplicates by normalised stem AND option set.
    seen_stems, seen_opts = set(), set()
    by_section = {name: [] for name, _n, _p, _g in section_targets}

    for (section, _topic, _size), items in zip(jobs, results):
        for q in items:
            stem = _normalise_stem(q.get("question", ""))
            if len(stem) < 12:
                continue
            opts = q.get("options") or {}
            if q.get("correctAnswer") not in opts:
                continue
            # Exactly five distinct, non-blank options. Accepting four let
            # papers through with a missing choice, and duplicated options make
            # more than one answer defensible.
            vals = [str(v).strip() for v in opts.values() if str(v).strip()]
            if len(vals) != 5 or len({v.lower() for v in vals}) != 5:
                continue
            # An unfinished stem — "find the profit%" with the principal never
            # stated — is unanswerable. A stem carrying no digits at all in a
            # numeric section is the cheap, reliable signal for that.
            if section != "English Language" and not q.get("passage") and not q.get("table"):
                if not re.search(r"\d", q.get("question", "")):
                    continue
            # Where the stem states an expression we can evaluate, check the key
            # rather than trust it — this is the only class of question whose
            # correctness is decidable server-side, and it is where the model
            # most often slips.
            if _arithmetic_answer_is_wrong(q):
                continue
            # Catches word problems the arithmetic checker cannot judge, whenever
            # the model has already told us the item is broken.
            if _explanation_admits_error(q):
                continue
            # Working that lands on a different number than the key — the failure
            # mode behind a Direction Sense item that computed sqrt(90) = 9.49
            # and then keyed 7.05.
            if _explanation_contradicts_key(q):
                continue
            sig = _option_signature(q)
            if stem in seen_stems or (sig and sig in seen_opts):
                continue
            seen_stems.add(stem)
            if sig:
                seen_opts.add(sig)
            by_section[section].append(q)

    # Top up any short section from the curated bank — section-matched and shuffled,
    # never the first N of a section-ordered file.
    try:
        bank = _load_fallback_bank()
    except Exception:
        bank = []
    bank_by_section = {}
    for q in bank:
        bank_by_section.setdefault(q.get("section"), []).append(q)

    questions = []
    for section, n, per, neg in section_targets:
        got = by_section.get(section, [])[:n]

        # Quantitative Aptitude is generated by the SERVER, not the model.
        # Asking an LLM for arithmetic produced questions whose key contradicted
        # their own working often enough to make the mock untrustworthy — real
        # reports included "0.999 + 0.0009" keyed to 1.001, "(2.001)^4" keyed to
        # 18, and three Simple Interest items whose correct answer was not among
        # the options at all. Here the numbers are chosen and the answer computed
        # in Python, so the key cannot be wrong. Model output is kept only to top
        # up whatever the generators do not cover.
        if section == "Quantitative Aptitude":
            from utils.quant_generator import generate as _gen_quant
            generated = _gen_quant(n)
            keep = [q for q in got
                    if _normalise_stem(q.get("question", "")) not in
                    {_normalise_stem(g["question"]) for g in generated}]
            got = (generated + keep)[:n]
        if len(got) < n:
            pool = [q for q in bank_by_section.get(section, [])
                    if _normalise_stem(q.get("question", "")) not in seen_stems]
            random.shuffle(pool)
            for q in pool[: n - len(got)]:
                seen_stems.add(_normalise_stem(q.get("question", "")))
                got.append(q)

        # Keep a SET together. Questions are generated one (section, topic) chunk
        # at a time and topped up from the bank afterwards, so a Data
        # Interpretation set could end up split — Q4 on the chart, Q5 an
        # unrelated arithmetic sum, Q6 back on the chart. In the real paper a DI
        # set is always consecutive, and the shared table only sits on its first
        # question, so a split set is unanswerable as well as jarring.
        # Sort by topic, and inside a topic put the passage/table-bearing
        # question first. Python's sort is stable, so questions with neither key
        # keep the order the model produced them in.
        got.sort(key=lambda q: (
            (q.get("topic") or "").strip().lower(),
            0 if (q.get("passage") or q.get("table")) else 1,
        ))

        for idx, q in enumerate(got, start=1):
            q["section"] = section
            q["marks"] = per
            q["negativeMarks"] = neg
            q.setdefault("expectedTime", 45)
            q.setdefault("passage", None)
            q.setdefault("table", None)
            q["id"] = f"mock-{section.split()[0].lower()}-{idx}"
            questions.append(q)

    if not questions:
        raise HTTPException(503, "Could not build a mock paper — AI unavailable and the question bank could not be read.")

    return {"questions": questions, "exam": {
        "duration": 60, "totalQuestions": len(questions), "totalMarks": 100,
        "sections": [{"name": n, "totalQuestions": c, "marks": m, "time": 20}
                     for n, c, m, _p, _g in IBPS_SECTION_PLAN],
    }}


# ── Mock Test Save / Load / Submit (user-scoped) ───────────────────────────────

class SaveMockTestReq(BaseModel):
    title: str
    questions: list

class SubmitMockTestReq(BaseModel):
    answers: dict
    results: dict


class PauseMockTestReq(BaseModel):
    """Everything needed to resume a half-finished attempt exactly where it stopped."""
    answers: dict = {}
    sectionIdx: int = 0
    timeLeft: int = 0
    currentQIndex: int = 0
    marked: list = []
    visited: list = []


@router.post("/ibps-po/mock-tests/save")
async def save_mock_test(req: SaveMockTestReq, user: dict = Depends(current_user)):
    """Save generated questions for later without starting the exam."""
    doc = {
        "userId": user["id"],
        "title": req.title.strip() or f"Mock Test — {datetime.now(timezone.utc).strftime('%b %d, %I:%M %p')}",
        "questions": req.questions,
        "status": "saved",
        "answers": None,
        "results": None,
        "createdAt": datetime.now(timezone.utc),
        "attemptedAt": None,
    }
    result = await col_mock_tests().insert_one(doc)
    return {"id": str(result.inserted_id), "title": doc["title"]}


@router.get("/ibps-po/mock-tests")
async def list_mock_tests(user: dict = Depends(current_user)):
    """List all saved mock tests for the current user (newest first)."""
    cursor = col_mock_tests().find(
        {"userId": user["id"]},
        {"questions": 0}  # exclude heavy questions array from list view
    ).sort("createdAt", -1).limit(50)
    tests = []
    async for doc in cursor:
        tests.append({
            "id": str(doc["_id"]),
            "title": doc.get("title", ""),
            "status": doc.get("status", "saved"),
            "results": doc.get("results"),
            "createdAt": doc.get("createdAt"),
            "attemptedAt": doc.get("attemptedAt"),
            "pausedAt": doc.get("pausedAt"),
            # enough to show "resume at Q37, Reasoning" without shipping the answers
            "progressSummary": (
                {
                    "answered": len(doc.get("progress", {}).get("answers", {}) or {}),
                    "sectionIdx": doc.get("progress", {}).get("sectionIdx", 0),
                    "currentQIndex": doc.get("progress", {}).get("currentQIndex", 0),
                }
                if doc.get("status") == "paused" else None
            ),
        })
    return {"tests": tests}


@router.get("/ibps-po/mock-tests/{test_id}")
async def get_mock_test(test_id: str, user: dict = Depends(current_user)):
    """Load a specific saved mock test (only owner can access)."""
    try:
        obj_id = oid(test_id)
    except Exception:
        raise HTTPException(400, "Invalid test ID")
    doc = await col_mock_tests().find_one({"_id": obj_id, "userId": user["id"]})
    if not doc:
        raise HTTPException(404, "Test not found")
    return {
        "id": str(doc["_id"]),
        "title": doc.get("title", ""),
        "questions": doc.get("questions", []),
        "status": doc.get("status", "saved"),
        "answers": doc.get("answers"),
        "results": doc.get("results"),
        "createdAt": doc.get("createdAt"),
        "attemptedAt": doc.get("attemptedAt"),
        "pausedAt": doc.get("pausedAt"),
        "progress": doc.get("progress"),
    }


@router.post("/ibps-po/mock-tests/{test_id}/submit")
async def submit_mock_test(test_id: str, req: SubmitMockTestReq, user: dict = Depends(current_user)):
    """Submit answers for a saved test and save results."""
    try:
        obj_id = oid(test_id)
    except Exception:
        raise HTTPException(400, "Invalid test ID")
    result = await col_mock_tests().update_one(
        {"_id": obj_id, "userId": user["id"]},
        {"$set": {
            "status": "attempted",
            "answers": req.answers,
            "results": req.results,
            "attemptedAt": datetime.now(timezone.utc),
        },
         "$unset": {"progress": "", "pausedAt": ""}}
    )
    if result.matched_count == 0:
        raise HTTPException(404, "Test not found")
    return {"ok": True}


@router.post("/ibps-po/mock-tests/{test_id}/pause")
async def pause_mock_test(test_id: str, req: PauseMockTestReq, user: dict = Depends(current_user)):
    """Park a half-finished attempt so it can be resumed from the same question,
    section and remaining sectional time."""
    try:
        obj_id = oid(test_id)
    except Exception:
        raise HTTPException(400, "Invalid test ID")
    result = await col_mock_tests().update_one(
        {"_id": obj_id, "userId": user["id"], "status": {"$ne": "attempted"}},
        {"$set": {
            "status": "paused",
            "progress": {
                "answers": req.answers,
                "sectionIdx": req.sectionIdx,
                "timeLeft": req.timeLeft,
                "currentQIndex": req.currentQIndex,
                "marked": req.marked,
                "visited": req.visited,
            },
            "pausedAt": datetime.now(timezone.utc),
        }}
    )
    if result.matched_count == 0:
        raise HTTPException(404, "Test not found, or it has already been submitted")
    return {"ok": True}


@router.post("/ibps-po/mock-tests/auto-save")
async def auto_save_mock_test(req: SaveMockTestReq, user: dict = Depends(current_user)):
    """Auto-save a test that was attempted but not manually saved (called on submit)."""
    doc = {
        "userId": user["id"],
        "title": req.title.strip() or f"Mock Test — {datetime.now(timezone.utc).strftime('%b %d, %I:%M %p')}",
        "questions": req.questions,
        "status": "saved",
        "answers": None,
        "results": None,
        "createdAt": datetime.now(timezone.utc),
        "attemptedAt": None,
    }
    result = await col_mock_tests().insert_one(doc)
    return {"id": str(result.inserted_id), "title": doc["title"]}


@router.delete("/ibps-po/mock-tests/{test_id}")
async def delete_mock_test(test_id: str, user: dict = Depends(current_user)):
    """Delete a saved mock test (only owner can delete)."""
    try:
        obj_id = oid(test_id)
    except Exception:
        raise HTTPException(400, "Invalid test ID")
    result = await col_mock_tests().delete_one({"_id": obj_id, "userId": user["id"]})
    if result.deleted_count == 0:
        raise HTTPException(404, "Test not found")
    return {"ok": True}



# ── AI Explain (paste anything) ───────────────────────────────────────────────

class ExplainReq(BaseModel):
    text: str


@router.post("/explain")
async def ai_explain(req: ExplainReq, _=Depends(require_ai_enabled)):
    if not req.text.strip():
        return {"explanation": ""}
    system = (
        "You are a senior JavaScript / frontend developer mentor. "
        "A developer has pasted code, an error, or a concept they don't understand. "
        "Explain it clearly in plain English using this structure:\n"
        "1. WHAT IT IS — one sentence saying what this is\n"
        "2. HOW IT WORKS — explain step by step in simple terms\n"
        "3. REAL-WORLD USE — one practical example of when/why you'd use it\n"
        "4. INTERVIEW ANGLE — the tricky thing interviewers test about this\n\n"
        "Keep each section short (2-4 sentences). No markdown symbols like ** or ##. "
        "Write section titles in CAPS followed by a dash."
    )
    user = f"Explain this to me:\n\n{req.text.strip()}"
    try:
        text = await _groq_plain(system, user, 600)
    except Exception:
        try:
            text = await _ollama_text_action(user)
        except Exception:
            text = "AI is unavailable right now. Please try again."
    return {"explanation": text}


# ── Challenge AI Expand ───────────────────────────────────────────────────────

class ChallengeExpandReq(BaseModel):
    title:    str
    topic:    str
    category: str
    summary:  str

@router.post("/challenge/expand")
async def challenge_expand(req: ChallengeExpandReq, _=Depends(require_ai_enabled)):
    system = (
        "You are a senior developer mentor explaining a technical concept to a developer preparing for interviews. "
        "Given a concept title and a one-line summary, produce a rich explanation in this EXACT JSON format:\n"
        '{"how_it_works": "...", "example": "...", "interview_angle": "...", "key_points": ["...", "...", "..."]}\n'
        "Rules:\n"
        "- how_it_works: 2-3 sentences explaining the mechanism clearly\n"
        "- example: one concrete real-world code example or scenario (short, practical)\n"
        "- interview_angle: the tricky edge case or gotcha interviewers love to test\n"
        "- key_points: exactly 3 short bullet strings (no bullet symbols)\n"
        "Respond ONLY with valid JSON. No markdown, no extra text."
    )
    user = f"Category: {req.category}\nTopic: {req.topic}\nTitle: {req.title}\nSummary: {req.summary}"
    import json as _json
    try:
        raw = await _groq_plain(system, user, 500)
        # Extract JSON from response
        start = raw.find("{")
        end   = raw.rfind("}") + 1
        data  = _json.loads(raw[start:end]) if start != -1 else {}
        return data
    except Exception:
        try:
            raw = await _ollama_text_action(user)
            start = raw.find("{"); end = raw.rfind("}") + 1
            data  = _json.loads(raw[start:end]) if start != -1 else {}
            return data
        except Exception:
            return {"how_it_works": "AI is unavailable right now.", "example": "", "interview_angle": "", "key_points": []}


# ── TypeScript Adder ──────────────────────────────────────────────────────────

class CodeReq(BaseModel):
    code: str

@router.post("/ts-add")
async def ts_add(req: CodeReq, _=Depends(require_ai_enabled)):
    if not req.code.strip():
        return {"result": ""}
    system = (
        "You are a TypeScript expert. The user will give you JavaScript code. "
        "Your job is to convert it to fully typed TypeScript. Rules:\n"
        "- Add proper type annotations to all variables, parameters, and return types\n"
        "- Use interfaces or type aliases for object shapes\n"
        "- Replace 'any' with specific types wherever possible\n"
        "- Use generics where appropriate\n"
        "- Add 'readonly' where data should not be mutated\n"
        "- Output ONLY the converted TypeScript code, no explanation, no markdown fences.\n"
        "If the code is already TypeScript, improve the types."
    )
    try:
        result = await _groq_plain(system, req.code.strip(), 1200)
    except Exception:
        result = "AI unavailable. Please try again."
    return {"result": result}


# ── Error Finder ───────────────────────────────────────────────────────────────

@router.post("/find-errors")
async def find_errors(req: CodeReq, _=Depends(require_ai_enabled)):
    if not req.code.strip():
        return {"result": ""}
    system = (
        "You are a code reviewer specializing in JavaScript, TypeScript, React, and Node.js. "
        "Analyze the code the user provides and find actual bugs and errors. Structure your response as:\n\n"
        "ERRORS FOUND — list each bug with:\n"
        "  Line/area: [where it is]\n"
        "  Problem: [what is wrong]\n"
        "  Fix: [the corrected code snippet]\n\n"
        "If no errors exist, say 'NO ERRORS FOUND — Code looks correct.' "
        "Focus on: syntax errors, logic bugs, undefined variables, wrong types, async issues, "
        "off-by-one errors, null/undefined dereferences. Do NOT use markdown symbols like ** or ##."
    )
    try:
        result = await _groq_plain(system, req.code.strip(), 800)
    except Exception:
        result = "AI unavailable. Please try again."
    return {"result": result}


# ── Potential Break Finder ─────────────────────────────────────────────────────

@router.post("/find-breaks")
async def find_breaks(req: CodeReq, _=Depends(require_ai_enabled)):
    if not req.code.strip():
        return {"result": ""}
    system = (
        "You are a senior software engineer doing a defensive code review. "
        "The user provides code. Your job is to find parts that COULD break at runtime "
        "under certain conditions — even if the code has no obvious syntax errors. Look for:\n"
        "- Uncaught exceptions / missing try-catch\n"
        "- Edge cases (empty arrays, null/undefined inputs, zero division)\n"
        "- Race conditions or unhandled promise rejections\n"
        "- Memory leaks (uncleared timers/listeners)\n"
        "- Incorrect assumptions about data shape\n"
        "- Performance bottlenecks that could timeout\n\n"
        "Structure: For each issue write:\n"
        "RISK [severity: High/Medium/Low]: [what could break]\n"
        "SCENARIO: [what input or condition triggers it]\n"
        "FIX: [how to prevent it]\n\n"
        "If the code is solid, say 'NO BREAK RISKS FOUND.' Do NOT use ** or ## markdown."
    )
    try:
        result = await _groq_plain(system, req.code.strip(), 800)
    except Exception:
        result = "AI unavailable. Please try again."
    return {"result": result}


# ── AI Dev Assistant: Git Helper ────────────────────────────────────────────────
# Reuses CodeReq{code} (not a separate {text} field) so the client's shared
# tool-runner (always POSTs {code}) works unchanged for these too.

@router.post("/git-help")
async def git_help(req: CodeReq, _=Depends(require_ai_enabled)):
    if not req.code.strip():
        return {"result": ""}
    system = (
        "You are a Git expert helping a developer. They'll describe a goal or problem in "
        "plain English (e.g. 'undo my last commit but keep the changes', 'squash my last 3 commits'). "
        "Respond with:\n\n"
        "COMMAND(S):\n[the exact git command(s) to run, one per line]\n\n"
        "WHAT THIS DOES: [1-2 sentence plain-English explanation]\n\n"
        "CAUTION: [only include this section if the command is destructive/irreversible, e.g. "
        "force push, hard reset, filter-branch — otherwise omit it entirely]\n\n"
        "Do NOT use markdown symbols like ** or ##. Be direct and concise."
    )
    try:
        result = await _groq_plain(system, req.code.strip(), 500)
    except Exception:
        result = "AI unavailable. Please try again."
    return {"result": result}


# ── AI Dev Assistant: Test Generator ────────────────────────────────────────────

@router.post("/generate-tests")
async def generate_tests(req: CodeReq, _=Depends(require_ai_enabled)):
    if not req.code.strip():
        return {"result": ""}
    system = (
        "You are a senior engineer writing unit tests. The user gives you a function. "
        "Write Jest test cases covering: the normal/happy path, edge cases (empty input, "
        "null/undefined, zero, negative numbers as applicable), and at least one case that "
        "would catch a plausible off-by-one or type-coercion bug. "
        "Output ONLY the test code (describe/it/test blocks with expect assertions), "
        "no explanation, no markdown fences."
    )
    try:
        result = await _groq_plain(system, req.code.strip(), 1000)
    except Exception:
        result = "AI unavailable. Please try again."
    return {"result": result}


# ── AI Dev Assistant: Concept / Docs Explainer ──────────────────────────────────

@router.post("/explain-concept")
async def explain_concept(req: CodeReq, _=Depends(require_ai_enabled)):
    if not req.code.strip():
        return {"result": ""}
    system = (
        "You are a senior developer explaining a technical concept, API, error message, or "
        "library to another developer. The user will give you a term, API name, error message, "
        "or short doc excerpt. Explain clearly in plain English: what it is, when/why you'd use "
        "it, and a short realistic code example if applicable. Keep it under 150 words. "
        "Do NOT use markdown symbols like ** or ##."
    )
    try:
        result = await _groq_plain(system, req.code.strip(), 500)
    except Exception:
        result = "AI unavailable. Please try again."
    return {"result": result}


# ── AI Dev Assistant: SQL Query Generator ───────────────────────────────────────

@router.post("/sql-query")
async def sql_query(req: CodeReq, _=Depends(require_ai_enabled)):
    if not req.code.strip():
        return {"result": ""}
    system = (
        "You are a SQL expert. The user describes what they want in plain English "
        "(e.g. 'get user id where email is x', 'count orders per customer last 30 days'). "
        "Respond with:\n\n"
        "QUERY:\n[the SQL query, standard ANSI SQL unless the user names a specific database]\n\n"
        "EXPLANATION: [1-2 sentence plain-English explanation of what it does]\n\n"
        "Do NOT use markdown code fences or ** or ##. Assume reasonable generic table/column "
        "names when none are given, and say so briefly in the explanation."
    )
    try:
        result = await _groq_plain(system, req.code.strip(), 500)
    except Exception:
        result = "AI unavailable. Please try again."
    return {"result": result}


# ── AI Dev Assistant: React Performance Analyzer ────────────────────────────────
# Static code review for React re-render/memoization anti-patterns — not a
# Lighthouse/runtime profiler. Real performance profiling needs a live page and
# headless Chrome, which is exactly the kind of heavy, slow, resource-hungry
# infra this app deliberately avoids; static analysis catches the vast majority
# of real-world React perf issues (unmemoized callbacks/objects passed as props,
# missing keys, unnecessary re-renders) with zero extra infrastructure.

@router.post("/react-performance")
async def react_performance(req: CodeReq, _=Depends(require_ai_enabled)):
    if not req.code.strip():
        return {"result": ""}
    system = (
        "You are a senior React performance engineer doing a static code review. "
        "The user gives you a React component. Look specifically for:\n"
        "- Unmemoized callbacks/objects/arrays passed as props (causes child re-renders)\n"
        "- Missing React.memo on components that would benefit from it\n"
        "- Missing or wrong useMemo/useCallback dependencies\n"
        "- index-as-key or unstable keys in lists\n"
        "- Expensive computations running on every render instead of memoized\n"
        "- Unnecessary state that could be derived instead\n"
        "- Long lists rendered without virtualization\n"
        "- useEffect with missing/incorrect dependency arrays causing extra renders\n\n"
        "Structure: For each issue write:\n"
        "ISSUE: [what's wrong]\n"
        "IMPACT: [why it hurts performance, be specific]\n"
        "FIX: [the corrected code]\n\n"
        "If the component is already well-optimized, say 'NO PERFORMANCE ISSUES FOUND — "
        "code is well-optimized.' Do NOT use markdown symbols like ** or ##."
    )
    try:
        result = await _groq_plain(system, req.code.strip(), 900)
    except Exception:
        result = "AI unavailable. Please try again."
    return {"result": result}


# ── Voice Mock Interview: speech-to-text ────────────────────────────────────────
# Transcription only — grading reuses the existing text-based /mock/evaluate
# endpoint unchanged, since a transcript is just plain text once we have it.
# Text-to-speech for reading the question aloud needs no backend at all: the
# client uses the browser's built-in SpeechSynthesis API, which is free and
# has zero latency (no upload, no API call).

VOICE_TRANSCRIBE_DAILY_LIMIT = 40
MAX_AUDIO_BYTES = 10 * 1024 * 1024  # 10MB — a few minutes of compressed speech


@router.post("/mock/transcribe")
async def mock_transcribe(audio: UploadFile = File(...), user=Depends(require_ai_enabled)):
    if not GROQ_API_KEY:
        raise HTTPException(503, "Voice transcription is not configured on this server.")

    today = date.today().isoformat()
    used_today = await col_voice_transcripts().count_documents({"userId": user["id"], "date": today})
    if used_today >= VOICE_TRANSCRIBE_DAILY_LIMIT:
        raise HTTPException(429, f"Daily voice transcription limit reached ({VOICE_TRANSCRIBE_DAILY_LIMIT}/day). Try again tomorrow, or type your answer instead.")

    audio_bytes = await audio.read()
    if len(audio_bytes) > MAX_AUDIO_BYTES:
        raise HTTPException(413, "Audio recording is too large (max 10MB — try a shorter answer).")
    if not audio_bytes:
        raise HTTPException(400, "No audio received.")

    headers = {"Authorization": f"Bearer {GROQ_API_KEY}"}
    files = {"file": (audio.filename or "answer.webm", audio_bytes, audio.content_type or "audio/webm")}
    data = {"model": "whisper-large-v3-turbo", "response_format": "json"}

    try:
        async with httpx.AsyncClient(timeout=30) as c:
            r = await c.post(
                "https://api.groq.com/openai/v1/audio/transcriptions",
                headers=headers, files=files, data=data,
            )
            r.raise_for_status()
            text = r.json().get("text", "").strip()
    except Exception:
        raise HTTPException(503, "Transcription is unavailable right now — try again shortly, or type your answer instead.")

    await col_voice_transcripts().insert_one({"userId": user["id"], "date": today, "createdAt": now()})
    return {"text": text}


# ── Mock Interview ────────────────────────────────────────────────────────────

class MockStartReq(BaseModel):
    category: str | None = None
    difficulty: str | None = None
    count: int = 7


class MockEvalReq(BaseModel):
    question: str
    topic: str
    title: str
    explanation: str
    user_answer: str


@router.post("/mock/start")
async def mock_start(req: MockStartReq, user=Depends(current_user)):
    """Return a set of interview questions from study topics."""
    from data.study_topics import STUDY_TOPICS
    pool = STUDY_TOPICS
    if req.category:
        cats = [c.strip() for c in req.category.split(",") if c.strip()]
        if cats:
            pool = [t for t in pool if t["category"] in cats]
    if req.difficulty and pool:
        filtered = [t for t in pool if t["difficulty"] == req.difficulty]
        # Fall back to full category pool if difficulty yields nothing
        pool = filtered if filtered else pool
    count = max(3, min(req.count, 15))
    if not pool:
        return {"questions": [], "total": 0, "warning": "No questions found for the selected filters."}
    selected = random.sample(pool, min(count, len(pool)))
    questions = [
        {
            "id": t["id"],
            "category": t["category"],
            "topic": t["topic"],
            "title": t["title"],
            "difficulty": t["difficulty"],
            "question": t["interviewQuestion"],
            "hint": t["summary"],
        }
        for t in selected
    ]
    return {"questions": questions, "total": len(questions)}


@router.post("/mock/evaluate")
async def mock_evaluate(req: MockEvalReq, _=Depends(require_ai_enabled)):
    """AI scores the user's answer 1-10 with feedback."""
    system = (
        "You are a senior developer interviewer evaluating a candidate's answer. "
        "Score the answer from 1 to 10 and give specific, constructive feedback. "
        "Respond in this EXACT format (no extra text):\n"
        "SCORE: <number>\n"
        "WHAT YOU GOT RIGHT: <1-2 sentences>\n"
        "WHAT YOU MISSED: <1-2 sentences of key points missing>\n"
        "MODEL ANSWER: <the ideal concise answer in 2-4 sentences>"
    )
    user = (
        f"Topic: {req.topic} — {req.title}\n"
        f"Interview question: {req.question}\n"
        f"Reference explanation: {req.explanation}\n\n"
        f"Candidate's answer: {req.user_answer or '(no answer given)'}\n\n"
        "Score and provide feedback."
    )
    try:
        raw = await _groq_plain(system, user, 400)
    except Exception:
        try:
            raw = await _ollama_text_action(user)
        except Exception:
            raw = "SCORE: 0\nWHAT YOU GOT RIGHT: AI unavailable\nWHAT YOU MISSED: AI unavailable\nMODEL ANSWER: AI unavailable"

    score = 0
    right = missed = model = ""
    for line in raw.splitlines():
        if line.startswith("SCORE:"):
            try:
                score = int(line.split(":")[1].strip().split()[0])
            except Exception:
                score = 5
        elif line.startswith("WHAT YOU GOT RIGHT:"):
            right = line.split(":", 1)[1].strip()
        elif line.startswith("WHAT YOU MISSED:"):
            missed = line.split(":", 1)[1].strip()
        elif line.startswith("MODEL ANSWER:"):
            model = line.split(":", 1)[1].strip()
    return {"score": score, "right": right, "missed": missed, "model_answer": model}


# ── Flashcard progress ────────────────────────────────────────────────────────

class FlashProgressReq(BaseModel):
    topic_id: str
    result: str  # "know" | "review"


@router.post("/flash/progress")
async def flash_progress(req: FlashProgressReq, user=Depends(current_user)):
    await col_progress().update_one(
        {"userId": user["id"], "topicId": req.topic_id},
        {"$set": {"result": req.result, "updatedAt": now()}},
        upsert=True,
    )
    return {"ok": True}


@router.get("/flash/progress")
async def get_flash_progress(user=Depends(current_user)):
    docs = await col_progress().find({"userId": user["id"]}).to_list(length=2000)
    return {d["topicId"]: d["result"] for d in docs}


# ── Study Guide "reviewed" tracking (DB-backed for logged-in users) ────────────
# Guests keep using localStorage client-side — these endpoints require auth,
# so they're only ever called once a user is actually logged in.

@router.get("/reviewed")
async def get_reviewed(user=Depends(current_user)):
    docs = await col_study_reviewed().find({"userId": user["id"]}).to_list(length=5000)
    return {"topicIds": [d["topicId"] for d in docs]}


@router.post("/reviewed/{topic_id}")
async def mark_reviewed(topic_id: str, user=Depends(current_user)):
    await col_study_reviewed().update_one(
        {"userId": user["id"], "topicId": topic_id},
        {"$set": {"reviewedAt": now()}},
        upsert=True,
    )
    return {"ok": True}


@router.delete("/reviewed/{topic_id}")
async def unmark_reviewed(topic_id: str, user=Depends(current_user)):
    await col_study_reviewed().delete_one({"userId": user["id"], "topicId": topic_id})
    return {"ok": True}


# ── Weak areas ─────────────────────────────────────────────────────────────────

@router.get("/weak-areas")
async def weak_areas(user=Depends(current_user)):
    # Two independent signals feed into this: Flashcards' explicit Know/Review
    # tap, and Study Hub's "Mark Reviewed" checkbox. A topic counts as "known"
    # if EITHER source says so; an explicit "review" tap from Flashcards always
    # wins since it's the strongest "I don't actually know this" signal.
    progress_docs = await col_progress().find({"userId": user["id"]}).to_list(length=2000)
    reviewed_docs = await col_study_reviewed().find({"userId": user["id"]}).to_list(length=5000)
    from data.study_topics import STUDY_TOPICS

    by_cat: dict[str, dict] = {}
    for t in STUDY_TOPICS:
        cat = t["category"]
        if cat not in by_cat:
            by_cat[cat] = {"total": 0, "know": 0, "review": 0, "unseen": 0}
        by_cat[cat]["total"] += 1

    progress_map = {d["topicId"]: d["result"] for d in progress_docs}
    reviewed_set = {d["topicId"] for d in reviewed_docs}
    for t in STUDY_TOPICS:
        cat = t["category"]
        flashcard_result = progress_map.get(t["id"])
        if flashcard_result == "review":
            result = "review"
        elif flashcard_result == "know" or t["id"] in reviewed_set:
            result = "know"
        else:
            result = "unseen"
        by_cat[cat][result] = by_cat[cat].get(result, 0) + 1

    result = []
    for cat, data in by_cat.items():
        total = data["total"]
        know = data.get("know", 0)
        review = data.get("review", 0)
        unseen = total - know - review
        score = round((know / total) * 100) if total else 0
        result.append({
            "category": cat,
            "total": total,
            "know": know,
            "review": review,
            "unseen": unseen,
            "score": score,
        })

    result.sort(key=lambda x: x["score"])
    return {"areas": result}


WEAK_AREA_INSIGHT_DAILY_REGENS = 3  # "Ask Again" refreshes allowed per user per day


async def _generate_weak_area_insight(user) -> str | None:
    areas_resp = await weak_areas(user=user)
    areas = [a for a in areas_resp["areas"] if a["total"] > 0]
    if not areas:
        return None

    weakest = sorted(areas, key=lambda a: a["score"])[:3]
    strongest = sorted(areas, key=lambda a: -a["score"])[:2]

    summary_lines = "\n".join(
        f"- {a['category']}: {a['score']}% mastered ({a['know']}/{a['total']} known, {a['unseen']} unseen)"
        for a in weakest
    )

    system = (
        "You are a supportive, direct developer interview coach. "
        "Given a user's per-category study progress, write ONE short coaching note. "
        "Plain English, max 3 sentences, no markdown, no bullet points, no headers. "
        "Name the specific weak categories and give one concrete next action. "
        "Vary your phrasing and the specific action you suggest each time — don't repeat the same wording."
    )
    prompt = (
        f"Weakest categories:\n{summary_lines}\n\n"
        f"Strongest categories: {', '.join(a['category'] for a in strongest) or 'none yet'}\n\n"
        "Write the coaching note now."
    )

    try:
        return await _groq_plain(system, prompt, max_tokens=150)
    except Exception:
        return None


@router.get("/weak-areas/insight")
async def weak_areas_insight(force: bool = False, user=Depends(require_ai_enabled)):
    """A short, personalized coaching note built from the same weak-areas data.
    Cached once per day by default so revisiting the page never re-triggers the
    AI call; pass force=true to regenerate on demand, capped at a few times a
    day per user so 'Ask Again' can't be spammed into heavy API usage."""
    today = now().strftime("%Y-%m-%d")
    user_id = user["id"]

    cached = await col_weak_area_insights().find_one({"userId": user_id, "date": today})

    if cached and not force:
        return {"insight": cached["insight"], "cached": True}

    if force:
        regen_count = cached.get("regenCount", 0) if cached else 0
        if regen_count >= WEAK_AREA_INSIGHT_DAILY_REGENS:
            return {
                "insight": cached["insight"] if cached else None,
                "cached": True,
                "regenLimitReached": True,
            }

    insight = await _generate_weak_area_insight(user)
    if insight is None:
        return {"insight": cached["insight"] if cached else None, "cached": bool(cached)}

    update = {"$set": {"insight": insight, "createdAt": now()}}
    if force:
        update["$inc"] = {"regenCount": 1}
    await col_weak_area_insights().update_one(
        {"userId": user_id, "date": today}, update, upsert=True,
    )
    return {"insight": insight, "cached": False}


DIFFICULTY_ORDER = {"Basic": 0, "Intermediate": 1, "Advanced": 2, "Tricky": 3}


@router.get("/mentor/learning-path")
async def mentor_learning_path(user=Depends(require_ai_enabled)):
    """A concrete, ordered 'study this next' list — the structured counterpart
    to the free-text weak-areas insight. Pure DB computation, zero AI calls,
    so it's instant and safe to load automatically (unlike the insight, which
    is opt-in specifically because it costs a Groq call)."""
    from data.study_topics import STUDY_TOPICS

    user_id = user["id"]
    progress_docs = await col_progress().find({"userId": user_id}).to_list(length=2000)
    reviewed_docs = await col_study_reviewed().find({"userId": user_id}).to_list(length=5000)
    progress_map = {d["topicId"]: d["result"] for d in progress_docs}
    reviewed_set = {d["topicId"] for d in reviewed_docs}

    def _is_known(t):
        return progress_map.get(t["id"]) == "know" or t["id"] in reviewed_set

    by_cat: dict[str, dict] = {}
    for t in STUDY_TOPICS:
        c = by_cat.setdefault(t["category"], {"total": 0, "know": 0})
        c["total"] += 1
        if _is_known(t):
            c["know"] += 1

    ranked_cats = sorted(by_cat.items(), key=lambda kv: kv[1]["know"] / kv[1]["total"])
    weakest_categories = [cat for cat, data in ranked_cats if data["total"] > 0][:3]

    candidates = [t for t in STUDY_TOPICS if t["category"] in weakest_categories and not _is_known(t)]
    candidates.sort(key=lambda t: (
        weakest_categories.index(t["category"]),
        DIFFICULTY_ORDER.get(t["difficulty"], 1),
    ))

    path = [
        {
            "id": t["id"],
            "category": t["category"],
            "title": t["title"],
            "difficulty": t["difficulty"],
            "topic": t["topic"],
        }
        for t in candidates[:8]
    ]

    return {"path": path, "focusCategories": weakest_categories}


# ── Daily Streak + Challenge ──────────────────────────────────────────────────

@router.get("/streak")
async def get_streak(user=Depends(current_user)):
    doc = await col_streaks().find_one({"userId": user["id"]})
    if not doc:
        return {"streak": 0, "lastActive": None, "todayDone": False, "challenge": await _daily_challenge(user["id"])}
    today = datetime.now(timezone.utc).date()
    last = doc.get("lastActive")
    if last:
        last_date = last.date() if hasattr(last, "date") else datetime.fromisoformat(str(last)).date()
        today_done = last_date == today
        streak = doc.get("streak", 0)
        if last_date < today - timedelta(days=1):
            streak = 0
    else:
        today_done = False
        streak = 0
    return {
        "streak": streak,
        "lastActive": doc.get("lastActive"),
        "todayDone": today_done,
        "challenge": await _daily_challenge(user["id"]),
    }


@router.post("/streak/complete")
async def complete_streak(user=Depends(current_user)):
    today = datetime.now(timezone.utc).date()
    doc = await col_streaks().find_one({"userId": user["id"]})
    streak = 1
    if doc:
        last = doc.get("lastActive")
        if last:
            last_date = last.date() if hasattr(last, "date") else datetime.fromisoformat(str(last)).date()
            if last_date == today:
                return {"streak": doc.get("streak", 1), "message": "Already completed today"}
            if last_date == today - timedelta(days=1):
                streak = doc.get("streak", 0) + 1
    await col_streaks().update_one(
        {"userId": user["id"]},
        {"$set": {"streak": streak, "lastActive": now()}},
        upsert=True,
    )
    return {"streak": streak, "message": f"Day {streak} complete! 🔥"}


def _format_challenge(topic: dict) -> dict:
    return {
        "id": topic["id"],
        "category": topic["category"],
        "topic": topic["topic"],
        "title": topic["title"],
        "difficulty": topic["difficulty"],
        "question": topic["interviewQuestion"],
        "summary": topic["summary"],
    }


async def _daily_challenge(user_id: str = None) -> dict:
    """Today's challenge topic — biased toward the user's weakest categories
    and topics they haven't seen yet, so it's a genuinely useful nudge instead
    of pure trivia. Deterministic per user+day (stable if you refresh, but
    different from everyone else's), computed with zero AI calls — this is
    plain weighted selection over data already in the DB."""
    from data.study_topics import STUDY_TOPICS
    today = datetime.now(timezone.utc).date()

    # random.Random(seed) is a LOCAL instance, unlike the global random.seed()/
    # random.choice() this replaced — that mutated process-wide random state,
    # which is a real race condition risk now that this function awaits DB
    # calls (other concurrent requests could interleave and get corrupted picks).
    if not user_id:
        seed = today.year * 10000 + today.month * 100 + today.day
        return _format_challenge(random.Random(seed).choice(STUDY_TOPICS))

    progress_docs = await col_progress().find({"userId": user_id}).to_list(length=2000)
    reviewed_docs = await col_study_reviewed().find({"userId": user_id}).to_list(length=5000)
    progress_map = {d["topicId"]: d["result"] for d in progress_docs}
    reviewed_set = {d["topicId"] for d in reviewed_docs}

    def _is_known(t):
        return progress_map.get(t["id"]) == "know" or t["id"] in reviewed_set

    by_cat: dict[str, dict] = {}
    for t in STUDY_TOPICS:
        c = by_cat.setdefault(t["category"], {"total": 0, "know": 0})
        c["total"] += 1
        if _is_known(t):
            c["know"] += 1

    weakest_categories = {
        cat for cat, _ in sorted(by_cat.items(), key=lambda kv: kv[1]["know"] / kv[1]["total"])[:5]
    }

    pool = [t for t in STUDY_TOPICS if t["category"] in weakest_categories and not _is_known(t)]
    if not pool:
        pool = [t for t in STUDY_TOPICS if not _is_known(t)] or STUDY_TOPICS

    rng = random.Random(f"{user_id}-{today.isoformat()}")
    return _format_challenge(rng.choice(pool))
