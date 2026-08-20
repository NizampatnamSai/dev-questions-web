"""Deterministic Quantitative Aptitude question generator.

Every question the AI produced for a numeric topic risked being wrong in a way
no amount of prompting fixed: it wrote plausible-looking options first and did
the arithmetic afterwards, then — repeatedly — appended a confession that its
own answer was not among them. Reported examples included "0.999 + 0.0009"
keyed to 1.001 (it is 0.9999), "(2.001)^4" keyed to 18 (it is 16.03), and three
consecutive Simple Interest items whose correct answer was absent entirely.

The fix is to stop asking a language model to do arithmetic. Here the SERVER
picks the numbers and computes the answer, so the key cannot disagree with the
question — correctness is structural, not probabilistic. Distractors are built
from the mistakes candidates actually make (forgetting to subtract the
principal, using simple interest where compound is meant, inverting a ratio),
which makes them useful rather than merely wrong.

Each generator returns the same shape the AI path produces, so the mock
assembler treats both identically.
"""
import collections
import random
import re
from decimal import Decimal, ROUND_HALF_UP


def _money(x) -> str:
    """Whole rupees where exact, else two decimals — never 1234.0000000001."""
    d = Decimal(str(x)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    return str(int(d)) if d == d.to_integral_value() else str(d.normalize())


def _pack(topic, question, answer, distractors, explanation, shortcut=None, difficulty="Moderate"):
    """Assemble options with the true answer in a random slot.

    Distractors that collide with the answer (or each other) after formatting
    are dropped and back-filled with nearby values, so every paper always has
    five distinct choices — the condition the AI path kept violating.
    """
    seen = {str(answer)}
    opts = []
    for d in distractors:
        s = str(d)
        if s not in seen:
            seen.add(s)
            opts.append(s)
    # Back-fill to five options. This MUST be additive, not multiplicative: an
    # answer of 0 (a markup exactly cancelled by a discount) multiplied by any
    # factor is still 0, so the old version could never find a new value and
    # span forever. A step derived from the answer's own magnitude always makes
    # progress, and the counter is a hard stop regardless.
    # Treat "35.48%" and "₹1,250" as numeric and keep the unit when synthesising
    # neighbours — the old test rejected anything with a suffix, so every
    # percentage answer fell into the non-numeric path.
    _m = re.fullmatch(r"(₹?)(-?\d+(?:\.\d+)?)(%?)", str(answer).replace(",", "").strip())
    numeric = _m is not None
    prefix, suffix = (_m.group(1), _m.group(3)) if numeric else ("", "")
    base = Decimal(_m.group(2)) if numeric else None
    step = (abs(base) / 10 if base else Decimal(0)) or Decimal(1)  # never 0
    if not numeric and len(opts) < 4:
        # A non-numeric answer cannot have plausible neighbours invented for it.
        # The old fallback appended "(1)", which put "Quantity I > Quantity II"
        # and "Quantity I > Quantity II (1)" in the same question. Callers must
        # supply the full option set instead; "None of these" is the only
        # legitimate filler.
        for filler in ("None of these", "Cannot be determined"):
            if filler not in seen and len(opts) < 4:
                seen.add(filler)
                opts.append(filler)
        if len(opts) < 4:
            raise ValueError(
                f"{topic}: only {len(opts) + 1} distinct options for a non-numeric answer "
                f"({answer!r}) — the generator must pass the complete choice set."
            )
    i = 1
    while len(opts) < 4 and i < 50:
        for delta in (i, -i):
            cand = f"{prefix}{_money(base + step * delta)}{suffix}"
            if str(cand) not in seen and len(opts) < 4:
                seen.add(str(cand))
                opts.append(str(cand))
        i += 1
    opts = opts[:4] + [str(answer)]
    random.shuffle(opts)
    letters = "ABCDE"
    options = {letters[i]: v for i, v in enumerate(opts)}
    correct = letters[opts.index(str(answer))]
    return {
        "topic": topic,
        "difficulty": difficulty,
        "question": question,
        "passage": None,
        "table": None,
        "options": options,
        "correctAnswer": correct,
        "explanation": explanation,
        "shortcut": shortcut or "",
        "generator": "deterministic",      # provenance: not model-written
    }


# ── Simple Interest ───────────────────────────────────────────────────────────
def simple_interest():
    p = random.choice([2000, 2500, 4000, 5000, 6000, 8000, 10000, 12000])
    r = random.choice([4, 5, 6, 8, 10, 12])
    t = random.choice([2, 3, 4, 5])
    si = p * r * t / 100
    return _pack(
        "Simple Interest",
        f"A sum of ₹{p:,} is lent at simple interest for {t} years at the rate of {r}% per annum. Find the interest.",
        _money(si),
        [_money(p * r / 100), _money(si + p), _money(p * r * t / 1000), _money(si / t)],
        f"SI = (P × R × T)/100 = ({p} × {r} × {t})/100 = ₹{_money(si)}.",
        "SI is straight-line — the interest for one year multiplied by the number of years.",
    )


def simple_interest_principal():
    r = random.choice([4, 5, 6, 8, 10])
    t = random.choice([2, 3, 4, 5])
    p = random.choice([2000, 3000, 4000, 5000, 6000, 8000])
    si = p * r * t / 100
    return _pack(
        "Simple Interest",
        f"A sum is lent at simple interest for {t} years at {r}% per annum. If the interest earned is ₹{_money(si)}, find the principal.",
        _money(p),
        [_money(p * 2), _money(si * t), _money(p / 2), _money(p + si)],
        f"P = (SI × 100)/(R × T) = ({_money(si)} × 100)/({r} × {t}) = ₹{_money(p)}.",
        "Rearrange SI = PRT/100 for P instead of guessing from the options.",
    )


# ── Compound Interest ─────────────────────────────────────────────────────────
def compound_interest():
    p = random.choice([5000, 8000, 10000, 12000, 15000, 20000])
    r = random.choice([5, 10, 20])
    t = 2
    amount = p * (1 + Decimal(r) / 100) ** t
    ci = amount - p
    si = p * r * t / 100
    return _pack(
        "Compound Interest",
        f"Find the compound interest on ₹{p:,} at {r}% per annum for {t} years, compounded annually.",
        _money(ci),
        [_money(si), _money(amount), _money(ci * 2), _money(p * r / 100)],
        f"Amount = P(1 + R/100)^T = {p}(1 + {r}/100)² = ₹{_money(amount)}. "
        f"CI = Amount − P = {_money(amount)} − {p} = ₹{_money(ci)}.",
        f"For 2 years the effective rate is 2R + R²/100 = {2 * r + r * r / 100}%.",
    )


def ci_si_difference():
    p = random.choice([5000, 10000, 20000, 25000, 40000])
    r = random.choice([5, 10, 20])
    diff = Decimal(p) * (Decimal(r) / 100) ** 2
    return _pack(
        "Compound Interest",
        f"Find the difference between the compound interest and the simple interest on ₹{p:,} at {r}% per annum for 2 years.",
        _money(diff),
        [_money(diff * 2), _money(p * r / 100), _money(diff / 2), _money(p * r * 2 / 100)],
        f"For 2 years, CI − SI = P(R/100)² = {p} × ({r}/100)² = ₹{_money(diff)}.",
        "CI − SI over 2 years is just one year's interest on the first year's interest.",
    )


# ── Percentage ────────────────────────────────────────────────────────────────
def percentage_of():
    base = random.choice([250, 400, 600, 800, 1200, 1500, 2400])
    pct = random.choice([12.5, 15, 20, 25, 30, 40, 60, 75])
    val = Decimal(str(base)) * Decimal(str(pct)) / 100
    return _pack(
        "Percentage",
        f"What is {pct}% of {base}?",
        _money(val),
        [_money(val * 2), _money(base - val), _money(val / 2), _money(base + val)],
        f"{pct}% of {base} = {base} × {pct}/100 = {_money(val)}.",
    )


def percentage_difference():
    b = random.choice([500, 800, 1000, 1500, 2000, 2500])
    pct = random.choice([20, 25, 40, 60, 75, 80])
    a = Decimal(b) * Decimal(pct) / 100
    diff = Decimal(b) - a
    return _pack(
        "Percentage",
        f"In an election, the votes polled by a candidate were {pct}% of the votes polled by his opponent. "
        f"If the opponent polled {b:,} votes, find the difference between their vote counts.",
        _money(diff),
        [_money(a), _money(b), _money(diff * 2), _money(Decimal(b) + a)],
        f"Candidate = {pct}% of {b} = {_money(a)}. Difference = {b} − {_money(a)} = {_money(diff)}.",
        f"The difference is simply (100 − {pct})% = {100 - pct}% of the opponent's votes.",
    )


# ── Profit & Loss ─────────────────────────────────────────────────────────────
def profit_percent():
    cp = random.choice([200, 250, 400, 500, 600, 800, 1000])
    pct = random.choice([10, 12.5, 15, 20, 25, 40])
    sp = Decimal(cp) * (100 + Decimal(str(pct))) / 100
    return _pack(
        "Profit and Loss",
        f"An article bought for ₹{cp} is sold for ₹{_money(sp)}. Find the profit percentage.",
        f"{_money(pct)}%",
        [f"{_money(Decimal(str(pct)) * 2)}%", f"{_money(Decimal(str(pct)) / 2)}%",
         f"{_money(100 - Decimal(str(pct)))}%", f"{_money(Decimal(str(pct)) + 5)}%"],
        f"Profit = {_money(sp)} − {cp} = ₹{_money(sp - cp)}. "
        f"Profit% = (Profit/CP) × 100 = ({_money(sp - cp)}/{cp}) × 100 = {_money(pct)}%.",
        "Profit% is always on COST price unless the question says otherwise.",
    )


# ── Average ───────────────────────────────────────────────────────────────────
def average_basic():
    n = random.choice([5, 6, 8, 10])
    avg = random.choice([12, 15, 20, 24, 30, 45])
    total = n * avg
    extra = random.choice([6, 10, 12, 18])
    new_avg = Decimal(total + extra * avg + extra) / (n + 1) if False else None  # unused branch
    return _pack(
        "Average",
        f"The average of {n} numbers is {avg}. Find their sum.",
        _money(total),
        [_money(total + avg), _money(total - avg), _money(avg * (n + 1)), _money(total / 2)],
        f"Sum = Average × Count = {avg} × {n} = {total}.",
    )


# ── Time, Speed & Distance ────────────────────────────────────────────────────
def train_crosses_pole():
    length = random.choice([120, 150, 180, 240, 300, 360])
    speed_ms = random.choice([10, 12, 15, 20, 25])
    t = Decimal(length) / speed_ms
    kmph = Decimal(speed_ms) * 18 / 5
    return _pack(
        "Problems on Trains",
        f"A train {length} m long crosses a pole in {_money(t)} seconds. Find its speed in km/hr.",
        _money(kmph),
        [_money(speed_ms), _money(kmph * 5 / 18), _money(kmph + 18), _money(kmph / 2)],
        f"Speed = Length/Time = {length}/{_money(t)} = {speed_ms} m/s. "
        f"Converting: {speed_ms} × 18/5 = {_money(kmph)} km/hr.",
        "A pole has no length — the train covers only its OWN length.",
    )


def speed_distance_time():
    speed = random.choice([40, 45, 50, 60, 72, 80])
    hours = random.choice([2, 3, 4, 5])
    dist = speed * hours
    return _pack(
        "Time, Speed and Distance",
        f"A car travels at {speed} km/hr for {hours} hours. Find the distance covered.",
        _money(dist),
        [_money(speed + hours), _money(dist / hours), _money(dist * 2), _money(speed * (hours + 1))],
        f"Distance = Speed × Time = {speed} × {hours} = {dist} km.",
    )


# ── Approximation / Simplification ────────────────────────────────────────────
def approximation_sum():
    """The exact family that failed: value computed, options built around it."""
    a = Decimal(str(random.choice([0.999, 9.98, 24.97, 49.99, 99.98])))
    b = Decimal(str(random.choice([0.0009, 0.02, 0.03, 1.01, 2.02])))
    val = a + b
    return _pack(
        "Approximation",
        f"The value of {a} + {b} is closest to",
        _money(round(val)),
        [_money(round(val) + 1), _money(round(val) - 1), _money(a), _money(round(val) + 2)],
        f"{a} + {b} = {val}, which is closest to {_money(round(val))}.",
        "Round each term to the nearest whole number before adding.",
    )


def approximation_product():
    a = random.choice([11.98, 15.02, 19.97, 24.99, 31.03])
    b = random.choice([3.99, 5.02, 7.98, 11.97])
    val = Decimal(str(a)) * Decimal(str(b))
    nearest = int(Decimal(val).quantize(Decimal("1"), rounding=ROUND_HALF_UP))
    return _pack(
        "Approximation",
        f"The value of {a} × {b} is closest to",
        str(nearest),
        [str(nearest + 8), str(nearest - 8), str(nearest * 2), str(max(1, nearest // 2))],
        f"{a} × {b} ≈ {round(a)} × {round(b)} = {round(a) * round(b)}; the exact product is {val}, "
        f"so the closest option is {nearest}.",
        "Round both factors first — the options are far enough apart that it never changes the answer.",
    )


# ── Mixtures & Alligation ─────────────────────────────────────────────────────
def mixture_replacement():
    """Replacement question — with the vessel size ALWAYS stated.

    A reported model-written item asked "a mixture contains 20% milk, 20 L is
    replaced with milk, find the final percentage" and never gave the total
    volume, which makes the answer anything from 28% to 52% depending on a
    number the candidate was never told. Stating V is what makes it a question.
    """
    v = random.choice([50, 80, 100, 120, 150, 200])
    pct = random.choice([10, 20, 25, 40, 50])
    out = random.choice([10, 20, 25, 30])
    while out >= v / 2:
        out = random.choice([10, 20])
    milk0 = Decimal(v) * pct / 100
    milk1 = milk0 - Decimal(out) * pct / 100 + out      # remove mixture, add pure milk
    final = milk1 / v * 100
    return _pack(
        "Mixture and Alligation",
        f"A vessel contains {v} litres of a milk-and-water mixture with {pct}% milk. "
        f"If {out} litres of the mixture is removed and replaced with {out} litres of pure milk, "
        f"what is the percentage of milk in the final mixture?",
        f"{_money(final)}%",
        [f"{pct}%", f"{_money(final + 4)}%", f"{_money(final - 4)}%", f"{_money(100 - final)}%"],
        f"Milk initially = {pct}% of {v} = {_money(milk0)} L. Removing {out} L of mixture removes "
        f"{_money(Decimal(out) * pct / 100)} L of milk, then {out} L of pure milk is added, so milk = "
        f"{_money(milk1)} L. The volume is unchanged at {v} L, so milk% = {_money(milk1)}/{v} × 100 = {_money(final)}%.",
        "Removing a MIXTURE takes out milk and water in the existing ratio — only the added liquid is pure.",
    )


def alligation_ratio():
    """Alligation, then apply the ratio to a total AND a profit target.

    The plain "find the ratio" version answered itself — with prices 40 and 80
    and a mean of 60 the answer is visibly 1:1 before any working.
    """
    from math import gcd
    c1 = random.choice([20, 24, 30, 36])
    c2 = random.choice([54, 60, 72, 84])
    while (c1 + c2) % 4:
        c2 = random.choice([54, 60, 72, 84])
    mean = c1 + (c2 - c1) * random.choice([1, 3]) // 4      # never the midpoint
    cheap, dear = c2 - mean, mean - c1
    g = gcd(cheap, dear) or 1
    total = random.choice([120, 160, 200, 240, 300])
    while total * cheap % (cheap + dear):
        total = random.choice([120, 240])
    qty1 = total * cheap // (cheap + dear)
    gain = random.choice([10, 20, 25])
    sp = Decimal(mean) * (100 + gain) / 100
    return _pack(
        "Mixture and Alligation",
        f"Two varieties of rice costing ₹{c1} and ₹{c2} per kg are mixed so that the mixture costs ₹{mean} per kg. "
        f"If {total} kg of the mixture is prepared and sold at a profit of {gain}%, find the quantity of the "
        f"cheaper variety used (in kg) and the selling price per kg.",
        f"{qty1} kg, ₹{_money(sp)}",
        [f"{total - qty1} kg, ₹{_money(sp)}", f"{qty1} kg, ₹{mean}",
         f"{total - qty1} kg, ₹{mean}", f"{qty1} kg, ₹{_money(Decimal(c2) * (100 + gain) / 100)}"],
        f"By alligation, cheaper : dearer = ({c2} − {mean}) : ({mean} − {c1}) = {cheap} : {dear} = "
        f"{cheap//g} : {dear//g}. Of {total} kg, the cheaper variety = {total} × {cheap}/{cheap + dear} = {qty1} kg. "
        f"SP = {mean} × {100 + gain}/100 = ₹{_money(sp)} per kg.",
        "Get the ratio by cross differences, apply it to the total, then take the profit on the MIXTURE's cost.",
        "Hard",
    )


# ── Time & Work ───────────────────────────────────────────────────────────────
def time_and_work():
    a = random.choice([10, 12, 15, 20, 24, 30])
    b = random.choice([10, 12, 15, 20, 30, 60])
    while b == a:
        b = random.choice([10, 12, 15, 20, 30, 60])
    together = Decimal(a * b) / (a + b)
    return _pack(
        "Time and Work",
        f"A can complete a piece of work in {a} days and B can complete it in {b} days. "
        f"Working together, in how many days will they finish it?",
        _money(together),
        [_money(a + b), _money(Decimal(a + b) / 2), _money(abs(a - b)), _money(together * 2)],
        f"Together = (A × B)/(A + B) = ({a} × {b})/({a} + {b}) = {_money(together)} days.",
        "Add the RATES, not the times — 1/A + 1/B, then invert.",
    )


def pipes_and_cisterns():
    fill = random.choice([6, 8, 10, 12, 15])
    empty = random.choice([12, 15, 20, 24, 30])
    while empty <= fill:
        empty = random.choice([20, 24, 30])
    net = Decimal(fill * empty) / (empty - fill)
    return _pack(
        "Pipes and Cisterns",
        f"A pipe fills a tank in {fill} hours while an outlet empties the full tank in {empty} hours. "
        f"If both are opened together, in how many hours will the tank be filled?",
        _money(net),
        [_money(empty - fill), _money(Decimal(fill * empty) / (empty + fill)), _money(fill + empty), _money(net / 2)],
        f"Net time = (fill × empty)/(empty − fill) = ({fill} × {empty})/({empty} − {fill}) = {_money(net)} hours.",
        "The outlet works against you, so the denominator is a DIFFERENCE, not a sum.",
    )


# ── Boats & Streams ───────────────────────────────────────────────────────────
def boats_and_streams():
    b = random.choice([8, 10, 12, 15, 18, 20])
    s = random.choice([2, 3, 4, 5])
    while s >= b:
        s = random.choice([2, 3])
    down, up = b + s, b - s
    d = random.choice([12, 24, 36, 48, 60])
    t = Decimal(d) / down
    return _pack(
        "Boats and Streams",
        f"The speed of a boat in still water is {b} km/hr and the speed of the stream is {s} km/hr. "
        f"How long will the boat take to cover {d} km downstream?",
        _money(t),
        [_money(Decimal(d) / up), _money(Decimal(d) / b), _money(t * 2), _money(Decimal(d) / (down + s))],
        f"Downstream speed = {b} + {s} = {down} km/hr. Time = Distance/Speed = {d}/{down} = {_money(t)} hours.",
        "Downstream ADDS the stream, upstream subtracts it.",
    )


# ── Partnership ───────────────────────────────────────────────────────────────
def partnership_profit():
    a = random.choice([2000, 3000, 4000, 5000, 6000])
    b = random.choice([3000, 4000, 6000, 8000, 9000])
    profit = random.choice([1200, 1800, 2400, 3000, 4500, 6000])
    from math import gcd
    g = gcd(a, b)
    share_a = Decimal(profit) * a / (a + b)
    return _pack(
        "Partnership",
        f"A and B start a business investing ₹{a:,} and ₹{b:,} respectively for the same period. "
        f"If the total profit is ₹{profit:,}, find A's share.",
        _money(share_a),
        [_money(Decimal(profit) * b / (a + b)), _money(Decimal(profit) / 2), _money(share_a / 2), _money(profit)],
        f"Profit is shared in the ratio of capital = {a}:{b} = {a//g}:{b//g}. "
        f"A's share = {profit} × {a}/({a} + {b}) = ₹{_money(share_a)}.",
        "For equal time periods the ratio is just capital; otherwise it is capital × time.",
    )


# ══ SBI/IBPS PO level — multi-step ════════════════════════════════════════════
# The generators above are one-step drills. Real PO papers chain three to five
# steps: a ratio some years ago plus a relation between two people, or a marked
# price with a discount AND a markup. These build questions at that level, still
# with the answer computed here rather than guessed.

def ages_ratio_relation():
    """Ratio n years ago, plus a third person defined off the first."""
    k = random.choice([3, 4, 5, 6, 7])
    r1, r2 = random.choice([(4, 3), (5, 3), (5, 4), (7, 5), (3, 2)])
    back = random.choice([4, 5, 6, 8])
    gap = random.choice([6, 8, 10, 12])
    m, n = r1 * k + back, r2 * k + back
    o = m + gap
    total = (n - back) + o                       # N's age `back` years ago + O now
    return _pack(
        "Problems on Ages",
        f"{back} years ago, the ratio of the ages of M and N was {r1} : {r2}. At present, O is {gap} years "
        f"older than M. The sum of N's age {back} years ago and O's present age is {total} years. "
        f"Find the present age of M.",
        _money(m),
        [_money(n), _money(o), _money(m + back), _money(m - back)],
        f"Let the ages {back} years ago be {r1}k and {r2}k. Then M = {r1}k + {back} and O = M + {gap} = {r1}k + {gap + back}. "
        f"Given {r2}k + ({r1}k + {gap + back}) = {total} → {r1 + r2}k = {total - gap - back} → k = {k}. "
        f"So M = {r1} × {k} + {back} = {m} years.",
        "Put everything in terms of k first — never in terms of two unknowns.",
        "Hard",
    )


def partnership_delayed_join():
    """C joins partway through, so profit is capital × TIME."""
    months_c = random.choice([3, 4, 6])
    c_cap = random.choice([24000, 30000, 36000, 42000])
    unit = c_cap * months_c // 12                # C's 12-month-equivalent per share
    pa, pb = random.choice([(26, 17), (13, 9), (15, 11), (21, 13)])
    pc = random.choice([6, 5, 4])
    one_part = Decimal(unit) / pc
    a_cap = int(one_part * pa)
    b_cap = int(one_part * pb)
    total = a_cap + b_cap
    return _pack(
        "Partnership",
        f"A and B started a business investing a total of ₹{total:,}. After {12 - months_c} months, C joined with "
        f"an investment of ₹{c_cap:,}. At the end of the year the profit was divided among A, B and C in the "
        f"ratio {pa} : {pb} : {pc}. Find A's investment.",
        _money(a_cap),
        [_money(b_cap), _money(c_cap), _money(total - a_cap // 2), _money(a_cap + b_cap)],
        f"C's capital × time = {c_cap} × {months_c} = {c_cap * months_c:,}, which is {pc} parts, so one part = "
        f"{_money(one_part * 12)} of capital×months. A invests for 12 months, so A × 12 = {pa} parts → "
        f"A = ₹{a_cap:,}. Check: A + B = {a_cap:,} + {b_cap:,} = ₹{total:,}.",
        "Convert everyone to capital × MONTHS before comparing — C was not in for the full year.",
        "Hard",
    )


def profit_markup_discount():
    """Marked price, a discount on it, and a markup over cost — three steps."""
    cp = random.choice([4000, 5000, 6000, 7500, 8000])
    markup = random.choice([25, 30, 40, 50])
    # The discount must be strictly smaller than the markup, or the "profit" is
    # negative and the question contradicts itself — markup 25% with discount
    # 25% gives a LOSS of ₹375 while asking for the profit earned.
    # Also exclude any discount that makes the profit exactly zero — markup 25%
    # with discount 20% cancels out, and 'find the profit earned' then has no answer.
    disc = random.choice([d for d in (10, 15, 20, 25)
                          if d < markup and (100 + markup) * (100 - d) != 10000])
    mp = Decimal(cp) * (100 + markup) / 100
    sp = mp * (100 - disc) / 100
    profit = sp - cp
    return _pack(
        "Profit and Loss",
        f"The marked price of an article is ₹{_money(mp)}. A discount of {disc}% is offered on the marked price. "
        f"If the article was marked {markup}% above its cost price, find the profit earned (in ₹).",
        _money(profit),
        [_money(mp - sp), _money(profit * 2), _money(cp * Decimal(markup) / 100), _money(abs(profit) + 100)],
        f"CP = MP ÷ (1 + {markup}/100) = {_money(mp)} ÷ {1 + Decimal(markup) / 100} = ₹{cp:,}. "
        f"SP = {_money(mp)} × (100 − {disc})/100 = ₹{_money(sp)}. Profit = {_money(sp)} − {cp} = ₹{_money(profit)}.",
        "Work back to CP from the marked price first — the discount applies to MP, the profit to CP.",
        "Hard",
    )


def successive_percentage_salary():
    """Two flat deductions, then two successive ones on what remains."""
    s = random.choice([48000, 60000, 72000, 90000, 96000])
    a, b = random.choice([(18, 22), (15, 25), (20, 20), (12, 28)])
    c, d = random.choice([(25, 20), (20, 25), (30, 10), (25, 40)])
    left = Decimal(s) * (100 - a - b) / 100
    left = left * (100 - c) / 100
    left = left * (100 - d) / 100
    return _pack(
        "Percentage",
        f"A man spends {a}% of his monthly salary on rent and {b}% on food. He then spends {c}% of the remaining "
        f"amount on education and {d}% of the amount left thereafter on entertainment. If he finally saves "
        f"₹{_money(left)}, find his monthly salary.",
        _money(s),
        [_money(Decimal(s) * Decimal("0.75")), _money(Decimal(s) * Decimal("1.25")), _money(left * 2), _money(Decimal(s) / 2)],
        f"After rent and food, {100 - a - b}% remains. Education takes {c}% of that, leaving "
        f"{(100 - a - b) * (100 - c) / 100}%. Entertainment takes {d}% of THAT, leaving "
        f"{(100 - a - b) * (100 - c) * (100 - d) / 10000}% of the salary = ₹{_money(left)}. "
        f"So salary = ₹{s:,}.",
        "Chain the multipliers — each percentage applies to what is LEFT, not to the original salary.",
        "Hard",
    )


def boats_quantity_comparison():
    """Two quantities to compare — the SBI PO staple."""
    b = random.choice([12, 16, 20, 24])
    frac = random.choice([(3, 8), (1, 4), (1, 2), (3, 4)])
    s = Decimal(b) * frac[0] / frac[1]
    while s >= b or s != s.to_integral_value():
        frac = (1, 4)
        s = Decimal(b) * frac[0] / frac[1]
    down, up = Decimal(b) + s, Decimal(b) - s
    d = int(up * down * 2 // (down + up)) * random.choice([2, 4])
    total_t = Decimal(d) / down + Decimal(d) / up
    d1 = int(up) * random.choice([8, 10, 12])
    d2 = int(b) * random.choice([8, 10, 12])
    t1, t2 = Decimal(d1) / up, Decimal(d2) / b
    ans = ("Quantity I > Quantity II" if t1 > t2 else
           "Quantity I < Quantity II" if t1 < t2 else "Quantity I = Quantity II")
    return _pack(
        "Boats and Streams",
        f"The speed of the stream is {frac[0]}/{frac[1]} of the speed of the boat in still water. The boat covers "
        f"{d} km downstream and {d} km upstream in {_money(total_t)} hours.\n"
        f"Quantity I: time taken to cover {d1} km upstream.\n"
        f"Quantity II: time taken to cover {d2} km in still water.",
        ans,
        # All five standard choices. Passing only four meant the one matching the
        # answer was dropped, leaving three, and _pack synthesised a fifth by
        # appending "(1)" — producing "Quantity I > Quantity II" alongside
        # "Quantity I > Quantity II (1)" in the same question.
        ["Quantity I > Quantity II", "Quantity I < Quantity II", "Quantity I = Quantity II",
         "Cannot be determined", "None of these"],
        f"Let the boat be x km/hr, so the stream is {frac[0]}x/{frac[1]}. Downstream = {down / b}x, upstream = {up / b}x. "
        f"{d}/({down / b}x) + {d}/({up / b}x) = {_money(total_t)} → x = {b}. Stream = {_money(s)}, "
        f"downstream = {_money(down)}, upstream = {_money(up)}. "
        f"Quantity I = {d1}/{_money(up)} = {_money(t1)} h; Quantity II = {d2}/{b} = {_money(t2)} h.",
        "Solve for the boat's speed once, then both quantities fall out.",
        "Hard",
    )


def quadratic_comparison():
    """Compare the root ranges of two quadratics — sign traps included."""
    def make():
        r1, r2 = random.choice([(-2, -3), (-1, -5), (2, 3), (1, 4), (-2, 5), (3, -4)])
        a = random.choice([1, 2, 3])
        return a, -a * (r1 + r2), a * r1 * r2, sorted([r1, r2])
    ax, bx, cx, xs = make()
    ay, by, cy, ys = make()
    # Two identical equations is a wasted question — the comparison is vacuous.
    for _ in range(20):
        if (ay, by, cy) != (ax, bx, cx):
            break
        ay, by, cy, ys = make()
    if min(xs) > max(ys):
        ans = "x > y"
    elif max(xs) < min(ys):
        ans = "x < y"
    elif min(xs) >= max(ys):
        ans = "x ≥ y"
    elif max(xs) <= min(ys):
        ans = "x ≤ y"
    else:
        ans = "x = y or no relation can be established"
    sgn = lambda v: f"+ {v}" if v >= 0 else f"− {abs(v)}"
    lead = lambda a: "" if a == 1 else a          # "y²", never "1y²"
    return _pack(
        "Quadratic Equations",
        f"I. {lead(ax)}x² {sgn(bx)}x {sgn(cx)} = 0\nII. {lead(ay)}y² {sgn(by)}y {sgn(cy)} = 0",
        ans,
        ["x > y", "x < y", "x ≥ y", "x ≤ y", "x = y or no relation can be established"],
        f"Roots of I: x = {xs[0]}, {xs[1]}. Roots of II: y = {ys[0]}, {ys[1]}. "
        f"Comparing every root of x with every root of y gives: {ans}.",
        "Compare the RANGES — if they overlap at all, the answer is \"no relation\".",
        "Hard",
    )


def mixture_ratio_after_addition():
    """Add pure water to a known mixture and re-express the ratio."""
    total = random.choice([96, 112, 128, 144, 180])
    water = random.choice([36, 42, 48, 54, 60])
    while water >= total or (total - water) % 2:
        water = random.choice([36, 48, 60])
    milk = total - water
    add = random.choice([6, 8, 12, 16])
    from math import gcd
    g = gcd(milk, water + add)
    return _pack(
        "Mixture and Alligation",
        f"A vessel contains {total} litres of a mixture of milk and water, in which the quantity of water is "
        f"{water} litres. If {add} litres of pure water is added to the vessel, what will be the ratio of milk "
        f"to water?",
        f"{milk // g} : {(water + add) // g}",
        [f"{(water + add) // g} : {milk // g}", f"{milk} : {water}", f"{milk // 2} : {water}",
         f"{milk // g + 1} : {(water + add) // g}"],
        f"Milk = {total} − {water} = {milk} L and stays unchanged. Water = {water} + {add} = {water + add} L. "
        f"Ratio = {milk} : {water + add} = {milk // g} : {(water + add) // g}.",
        "Only the water changes — the milk is untouched, so do not recompute it.",
        "Hard",
    )


def approximation_multi_term():
    """PO-style approximation: percentage-of, a product and a root in one line."""
    p = random.choice([24.97, 15.02, 39.98, 12.03])
    base = random.choice([1599, 2401, 3199, 4801])
    a, b = random.choice([(17.98, 11.97), (23.03, 8.02), (14.98, 15.97)])
    sq = random.choice([256, 361, 441, 576, 625])
    val = Decimal(str(round(p))) * base / 100 + Decimal(str(round(a))) * Decimal(str(round(b))) + Decimal(sq).sqrt()
    nearest = int(val.quantize(Decimal("1"), rounding=ROUND_HALF_UP))
    step = max(20, nearest // 12)
    return _pack(
        "Approximation",
        f"What approximate value should come in place of the question mark?\n"
        f"{p}% of {base} + {a} × {b} + √{sq} = ?",
        str(nearest),
        [str(nearest + step), str(nearest - step), str(nearest + 2 * step), str(nearest - 2 * step)],
        f"Round each part: {round(p)}% of {base} ≈ {_money(Decimal(str(round(p))) * base / 100)}, "
        f"{round(a)} × {round(b)} = {round(a) * round(b)}, √{sq} = {int(Decimal(sq).sqrt())}. "
        f"Total ≈ {nearest}.",
        "Round every term FIRST — the options are spaced far enough apart that it never changes the answer.",
        "Hard",
    )


def si_ci_combined():
    """Find a principal from SI, then use it for CI — two instruments, one chain."""
    p = random.choice([8000, 10000, 12000, 15000, 20000])
    r = random.choice([5, 10, 20])
    t = random.choice([3, 4, 5])
    si = Decimal(p) * r * t / 100
    ci = Decimal(p) * (1 + Decimal(r) / 100) ** 2 - p
    return _pack(
        "Compound Interest",
        f"The simple interest on a sum at {r}% per annum for {t} years is ₹{_money(si)}. Find the compound "
        f"interest on the same sum at the same rate for 2 years, compounded annually.",
        _money(ci),
        [_money(si), _money(Decimal(p) * r * 2 / 100), _money(ci * 2), _money(p)],
        f"P = (SI × 100)/(R × T) = ({_money(si)} × 100)/({r} × {t}) = ₹{p:,}. "
        f"CI for 2 years = P[(1 + R/100)² − 1] = ₹{_money(ci)}.",
        "Recover the principal from the SI leg first — the two legs share P and R, not T.",
        "Hard",
    )


def approximation_percentage_chain():
    """A different SHAPE from the three-term sum — percentage of a percentage."""
    p1 = random.choice([19.98, 24.97, 34.99, 44.96])
    p2 = random.choice([39.97, 49.98, 59.99])
    base = random.choice([1199, 1601, 2399, 3201])
    sub = random.choice([149.03, 199.97, 249.98])
    val = (Decimal(str(round(p1))) / 100) * (Decimal(str(round(p2))) / 100) * base + Decimal(str(round(sub)))
    nearest = int(val.quantize(Decimal("1"), rounding=ROUND_HALF_UP))
    step = max(15, nearest // 10)
    return _pack(
        "Approximation",
        f"What approximate value should come in place of the question mark?\n"
        f"{p1}% of {p2}% of {base} + {sub} = ?",
        str(nearest),
        [str(nearest + step), str(nearest - step), str(nearest + 2 * step), str(nearest - 2 * step)],
        f"Round: {round(p1)}% of {round(p2)}% of {base} ≈ "
        f"{_money(Decimal(str(round(p1))) / 100 * Decimal(str(round(p2))) / 100 * base)}, plus {round(sub)} "
        f"gives about {nearest}.",
        "Chain the two percentages into one multiplier before touching the base.",
        "Hard",
    )


def approximation_fraction_mix():
    """Fractions and a division — another distinct shape."""
    a = random.choice([1439.97, 2159.02, 2879.98])
    f1, f2 = random.choice([(3, 8), (5, 12), (7, 16), (5, 6)])
    d = random.choice([11.98, 15.03, 23.97])
    add = random.choice([289.96, 359.04, 419.98])
    val = Decimal(str(round(a))) * f1 / f2 / Decimal(str(round(d))) + Decimal(str(round(add)))
    nearest = int(val.quantize(Decimal("1"), rounding=ROUND_HALF_UP))
    step = max(12, nearest // 10)
    return _pack(
        "Approximation",
        f"What approximate value should come in place of the question mark?\n"
        f"({a} × {f1}/{f2}) ÷ {d} + {add} = ?",
        str(nearest),
        [str(nearest + step), str(nearest - step), str(nearest + 2 * step), str(nearest - 2 * step)],
        f"Round: {round(a)} × {f1}/{f2} ≈ {_money(Decimal(str(round(a))) * f1 / f2)}, ÷ {round(d)} ≈ "
        f"{_money(Decimal(str(round(a))) * f1 / f2 / Decimal(str(round(d))))}, + {round(add)} ≈ {nearest}.",
        "Do the fraction first — it usually cancels against the divisor.",
        "Hard",
    )


def ages_present_future():
    """A different age SHAPE: present ratio plus a future condition."""
    r1, r2 = random.choice([(5, 3), (7, 4), (4, 3), (9, 5)])
    k = random.choice([3, 4, 5, 6])
    ahead = random.choice([4, 6, 8, 10])
    a, b = r1 * k, r2 * k
    return _pack(
        "Problems on Ages",
        f"The present ages of A and B are in the ratio {r1} : {r2}. After {ahead} years, the sum of their ages "
        f"will be {a + b + 2 * ahead} years. Find the present age of A.",
        _money(a),
        [_money(b), _money(a + ahead), _money(b + ahead), _money(a - ahead)],
        f"Let the ages be {r1}k and {r2}k. After {ahead} years their sum is {r1 + r2}k + {2 * ahead} = "
        f"{a + b + 2 * ahead}, so {r1 + r2}k = {a + b} and k = {k}. A = {r1} × {k} = {a} years.",
        "Adding t years to each of two people adds 2t to their sum, not t.",
        "Moderate",
    )


def profit_two_articles():
    """Different P&L shape: two articles, one gain one loss, net effect."""
    cp = random.choice([1200, 1500, 1800, 2400])
    pct = random.choice([10, 20, 25])
    sp = Decimal(cp) * (100 + pct) / 100
    cp2 = sp * 100 / (100 - pct)
    net = (sp * 2) - (Decimal(cp) + cp2)
    return _pack(
        "Profit and Loss",
        f"Two articles are each sold for ₹{_money(sp)}. On the first there is a gain of {pct}% and on the "
        f"second a loss of {pct}%. Find the overall gain or loss (in ₹).",
        _money(abs(net)),
        [_money(abs(net) * 2), "0", _money(Decimal(cp) * pct / 100), _money(abs(net) / 2)],
        f"CP of the first = {_money(sp)} × 100/{100 + pct} = ₹{cp}. CP of the second = {_money(sp)} × "
        f"100/{100 - pct} = ₹{_money(cp2)}. Total CP = ₹{_money(Decimal(cp) + cp2)} against total SP "
        f"₹{_money(sp * 2)}, a net LOSS of ₹{_money(abs(net))}.",
        f"Equal % gain and loss on the same SP is always a net loss of x²/100 % — never zero.",
        "Hard",
    )


# ── Number Series ─────────────────────────────────────────────────────────────
# The series is BUILT from a rule, so the missing term and the planted wrong
# term are both known exactly. The paper asks two forms of this and the section
# carries ~5 of them, but there was no generator at all until now.

def _series(rule, start, n=6):
    """Apply a step rule repeatedly from a starting value."""
    out = [Decimal(start)]
    for i in range(n - 1):
        out.append(rule(out[-1], i))
    return out


SERIES_RULES = [
    # (label, step function, starting value, human-readable pattern)
    ("difference grows by a constant", lambda v, i: v + 3 + 2 * i, 5, "+3, +5, +7, +9, +11"),
    ("multiply then add", lambda v, i: v * 2 + 1, 4, "×2 + 1 each time"),
    ("multiply then subtract", lambda v, i: v * 3 - 2, 3, "×3 − 2 each time"),
    ("successive squares added", lambda v, i: v + (i + 2) ** 2, 6, "+2², +3², +4², +5², +6²"),
    ("halving", lambda v, i: v / 2, 512, "÷2 each time"),
    ("multiply by rising integers", lambda v, i: v * (i + 2), 3, "×2, ×3, ×4, ×5, ×6"),
    ("difference of consecutive cubes", lambda v, i: v + (i + 2) ** 3, 4, "+2³, +3³, +4³, +5³"),
    ("alternate add and multiply", lambda v, i: v * 2 if i % 2 == 0 else v + 6, 7, "×2, +6, ×2, +6, ×2"),
]


def number_series_missing():
    label, rule, start, pattern = random.choice(SERIES_RULES)
    vals = _series(rule, start)
    hide = random.choice([len(vals) - 1, len(vals) - 1, len(vals) - 2])   # usually the last
    answer = vals[hide]
    shown = ["?" if i == hide else _money(v) for i, v in enumerate(vals)]
    return _pack(
        "Number Series",
        f"What will come in place of the question mark (?) in the following series?\n\n"
        f"{', '.join(shown)}",
        _money(answer),
        [_money(answer * 2), _money(answer + vals[1] - vals[0]), _money(answer - 4), _money(answer + 6)],
        f"The pattern is {pattern} ({label}). The full series is "
        f"{', '.join(_money(v) for v in vals)}, so the missing term is {_money(answer)}.",
        "Take first differences before anything else; if they are not constant, take differences again.",
        "Moderate",
    )


def number_series_wrong_term():
    label, rule, start, pattern = random.choice(SERIES_RULES)
    vals = _series(rule, start)
    bad_at = random.randint(2, len(vals) - 1)
    correct = vals[bad_at]
    offset = random.choice([2, 3, 4, -2, -3])
    planted = correct + offset
    shown = [_money(planted) if i == bad_at else _money(v) for i, v in enumerate(vals)]
    return _pack(
        "Wrong Number Series",
        f"Find the WRONG term in the following series.\n\n{', '.join(shown)}",
        _money(planted),
        [_money(vals[0]), _money(vals[1]), _money(vals[-1]),
         _money(vals[bad_at - 1])],
        f"The pattern is {pattern} ({label}). Following it, the term in that position should be "
        f"{_money(correct)}, not {_money(planted)} — so {_money(planted)} is the wrong term.",
        "Establish the rule from the first three terms, then test forward; the first break is the answer.",
        "Moderate",
    )


# ══ Data Interpretation ═══════════════════════════════════════════════════════
# A DI generator returns a LIST of questions sharing one data set. The table is
# attached to EVERY question of the set, not just the first — sitting the paper
# one question at a time, a candidate on Q3 must still be able to see the data.

def _di_pack(topic, table_note, columns, rows, items):
    """Wrap a DI set so every question carries the same chart data."""
    out = []
    for q_text, answer, distractors, expl in items:
        q = _pack(topic, q_text, answer, distractors, expl, None, "Hard")
        q["passage"] = table_note
        q["table"] = {"columns": columns, "rows": rows}
        out.append(q)
    return out


def di_pie_set():
    """Pie chart: percentage distribution of a known total across five schools."""
    total = random.choice([2400, 3000, 3600, 4800, 6000])
    while True:
        pcts = random.sample([10, 12, 14, 15, 16, 18, 20, 22, 25], 5)
        if sum(pcts) == 100:
            break
        pcts[-1] = 100 - sum(pcts[:-1])
        if 5 <= pcts[-1] <= 30 and len(set(pcts)) == 5:
            break
    names = ["P", "Q", "R", "S", "T"]
    vals = [total * p // 100 for p in pcts]
    # Only the percentages are shown. Printing the student counts as well turned
    # every question into a table lookup instead of a calculation.
    rows = [[n, f"{p}%"] for n, p in zip(names, pcts)]
    note = (f"The pie chart below shows the percentage distribution of {total:,} students across five "
            f"schools P, Q, R, S and T. Study the data and answer the questions.")

    i, j = random.sample(range(5), 2)
    k, l = random.sample(range(5), 2)
    from math import gcd
    g = gcd(vals[k], vals[l]) or 1
    three = random.sample(range(5), 3)
    avg = Decimal(sum(vals[x] for x in three)) / 3
    pct_of = Decimal(vals[i]) / vals[j] * 100

    return _di_pack(
        "Data Interpretation", note, ["School", "Share of total"], rows,
        [
            (f"What is the total number of students in schools {names[i]} and {names[j]} together?",
             _money(vals[i] + vals[j]),
             [_money(abs(vals[i] - vals[j])), _money(vals[i]), _money(vals[j]), _money(vals[i] + vals[j] + 100)],
             f"{names[i]} = {pcts[i]}% of {total} = {vals[i]}, {names[j]} = {pcts[j]}% of {total} = {vals[j]}. "
             f"Total = {vals[i] + vals[j]}."),

            (f"The number of students in school {names[k]} is what percent of the number in school {names[l]}? "
             f"(rounded to two decimals)",
             f"{_money(Decimal(vals[k]) / vals[l] * 100)}%",
             [f"{_money(Decimal(vals[l]) / vals[k] * 100)}%", f"{pcts[k]}%", f"{pcts[l]}%",
              f"{_money(Decimal(vals[k]) / total * 100)}%"],
             f"{names[k]} = {vals[k]}, {names[l]} = {vals[l]}. Required % = {vals[k]}/{vals[l]} × 100 = "
             f"{_money(Decimal(vals[k]) / vals[l] * 100)}%."),

            (f"Find the ratio of the number of students in school {names[k]} to that in school {names[l]}.",
             f"{vals[k]//g} : {vals[l]//g}",
             [f"{vals[l]//g} : {vals[k]//g}", f"{pcts[k]} : {pcts[l]}", "1 : 2", f"{vals[k]//g + 1} : {vals[l]//g}"],
             f"Ratio = {vals[k]} : {vals[l]} = {vals[k]//g} : {vals[l]//g} (dividing by {g})."),

            (f"What is the average number of students in schools {names[three[0]]}, {names[three[1]]} and "
             f"{names[three[2]]}?",
             _money(avg),
             [_money(avg * 3), _money(avg / 3), _money(avg + 100), _money(avg - 100)],
             f"Sum = {vals[three[0]]} + {vals[three[1]]} + {vals[three[2]]} = "
             f"{sum(vals[x] for x in three)}. Average = {sum(vals[x] for x in three)}/3 = {_money(avg)}."),

            (f"By how much does the number of students in school {names[i]} exceed or fall short of the number "
             f"in school {names[j]}?",
             _money(abs(vals[i] - vals[j])),
             [_money(vals[i] + vals[j]), _money(vals[i]), _money(vals[j]), _money(abs(vals[i] - vals[j]) * 2)],
             f"Difference = |{vals[i]} − {vals[j]}| = {abs(vals[i] - vals[j])} students."),
        ],
    )


def di_bar_set():
    """Bar graph: two products across four years."""
    years = [2021, 2022, 2023, 2024]
    a = [random.choice([120, 150, 180, 200, 240, 300]) for _ in years]
    b = [random.choice([100, 140, 160, 220, 260, 280]) for _ in years]
    # No Total column — "what is the total sold in 2023" must require adding the
    # two bars, not reading a third one.
    rows = [[str(y), str(x), str(z)] for y, x, z in zip(years, a, b)]
    note = ("The bar graph below shows the number of units (in thousands) of Product A and Product B sold by a "
            "company over four years. Study the data and answer the questions.")

    i, j = random.sample(range(4), 2)
    for _ in range(20):
        if a[i] != a[j]:
            break
        i, j = random.sample(range(4), 2)
    from math import gcd
    g = gcd(a[i], b[i]) or 1
    tot_a, tot_b = sum(a), sum(b)
    avg_a = Decimal(tot_a) / 4
    growth = Decimal(a[j] - a[i]) / a[i] * 100

    return _di_pack(
        "Data Interpretation", note, ["Year", "Product A", "Product B"], rows,
        [
            (f"What is the total number of units (in thousands) of both products sold in {years[i]} and "
             f"{years[j]} taken together?",
             _money(a[i] + b[i] + a[j] + b[j]),
             [_money(a[i] + b[i]), _money(a[j] + b[j]), _money(abs((a[i] + b[i]) - (a[j] + b[j]))),
              _money(a[i] + a[j])],
             f"{years[i]}: {a[i]} + {b[i]} = {a[i] + b[i]}. {years[j]}: {a[j]} + {b[j]} = {a[j] + b[j]}. "
             f"Total = {a[i] + b[i] + a[j] + b[j]} thousand units."),

            (f"Find the ratio of Product A to Product B sold in {years[i]}.",
             f"{a[i]//g} : {b[i]//g}",
             [f"{b[i]//g} : {a[i]//g}", f"{a[i]} : {b[i]+10}", "1 : 1", f"{a[i]//g + 1} : {b[i]//g}"],
             f"Ratio = {a[i]} : {b[i]} = {a[i]//g} : {b[i]//g}."),

            (f"The sales of Product A in {years[j]} showed what percent change over {years[i]}? "
             f"(rounded to two decimals)",
             f"{_money(growth)}%",
             [f"{_money(-growth)}%", f"{_money(Decimal(a[j] - a[i]) / a[j] * 100)}%",
              f"{_money(growth * 2)}%", f"{_money(growth / 2)}%"],
             f"Change = ({a[j]} − {a[i]})/{a[i]} × 100 = {_money(growth)}%."),

            ("What is the average annual sale of Product A over the four years (in thousands)?",
             _money(avg_a),
             [_money(Decimal(tot_b) / 4), _money(tot_a), _money(avg_a * 2), _money(avg_a - 20)],
             f"Total A = {a[0]} + {a[1]} + {a[2]} + {a[3]} = {tot_a}. Average = {tot_a}/4 = {_money(avg_a)}."),

            ("Over the four years taken together, the total sale of Product A exceeds that of Product B by how "
             "many thousand units?",
             _money(abs(tot_a - tot_b)),
             [_money(tot_a + tot_b), _money(tot_a), _money(tot_b), _money(abs(tot_a - tot_b) * 2)],
             f"Total A = {tot_a}, Total B = {tot_b}. Difference = {abs(tot_a - tot_b)} thousand units."),
        ],
    )


def di_line_set():
    """Line graph: production across five months, two units plotted."""
    months = ["January", "February", "March", "April", "May"]
    x = [random.choice([240, 300, 360, 420, 480, 540]) for _ in months]
    y = [random.choice([180, 220, 280, 320, 400, 460]) for _ in months]
    rows = [[m, str(p), str(q)] for m, p, q in zip(months, x, y)]
    note = ("The line graph below shows the number of units produced by Unit I and Unit II of a factory over "
            "five months. Study the data and answer the questions.")
    # Pick two months whose Unit I values DIFFER, or the percent-change question
    # has answer 0% and every distractor collapses onto it.
    i, j = random.sample(range(5), 2)
    for _ in range(20):
        if x[i] != x[j]:
            break
        i, j = random.sample(range(5), 2)
    from math import gcd
    g = gcd(x[i], y[i]) or 1
    tot_x, tot_y = sum(x), sum(y)
    diff = Decimal(x[j] - x[i]) / x[i] * 100
    return _di_pack(
        "Data Interpretation", note, ["Month", "Unit I", "Unit II"], rows,
        [
            (f"What is the combined production of both units in {months[i]} and {months[j]} together?",
             _money(x[i] + y[i] + x[j] + y[j]),
             [_money(x[i] + y[i]), _money(x[j] + y[j]), _money(abs((x[i] + y[i]) - (x[j] + y[j]))),
              _money(x[i] + x[j])],
             f"{months[i]}: {x[i]} + {y[i]} = {x[i] + y[i]}. {months[j]}: {x[j]} + {y[j]} = {x[j] + y[j]}. "
             f"Combined = {x[i] + y[i] + x[j] + y[j]} units."),
            (f"Find the ratio of Unit I to Unit II production in {months[i]}.", f"{x[i]//g} : {y[i]//g}",
             [f"{y[i]//g} : {x[i]//g}", "1 : 1", f"{x[i]} : {y[i] + 20}", f"{x[i]//g + 1} : {y[i]//g}"],
             f"Ratio = {x[i]} : {y[i]} = {x[i]//g} : {y[i]//g}."),
            (f"Unit I production in {months[j]} changed by what percent compared with {months[i]}? "
             f"(rounded to two decimals)", f"{_money(diff)}%",
             [f"{_money(-diff)}%", f"{_money(diff * 2)}%", f"{_money(diff / 2)}%",
              f"{_money(Decimal(x[j] - x[i]) / x[j] * 100)}%"],
             f"Change = ({x[j]} − {x[i]})/{x[i]} × 100 = {_money(diff)}%."),
            ("What is the average monthly production of Unit II over the five months?", _money(Decimal(tot_y) / 5),
             [_money(Decimal(tot_x) / 5), _money(tot_y), _money(Decimal(tot_y) / 4), _money(Decimal(tot_y) / 5 + 50)],
             f"Total Unit II = {tot_y}. Average = {tot_y}/5 = {_money(Decimal(tot_y) / 5)} units."),
            ("Over the five months, the total production of Unit I exceeds that of Unit II by how many units?",
             _money(abs(tot_x - tot_y)),
             [_money(tot_x + tot_y), _money(tot_x), _money(tot_y), _money(abs(tot_x - tot_y) * 2)],
             f"Unit I total = {tot_x}, Unit II total = {tot_y}. Difference = {abs(tot_x - tot_y)}."),
        ],
    )


def di_table_set():
    """Tabular DI: employees per department, split male/female."""
    depts = ["Sales", "HR", "IT", "Finance", "Admin"]
    total = [random.choice([240, 300, 360, 400, 480]) for _ in depts]
    male = [t * random.choice([40, 45, 50, 55, 60, 65]) // 100 for t in total]
    female = [t - m for t, m in zip(total, male)]
    # Total and the male PERCENTAGE. Listing male and female counts outright left
    # nothing to work out.
    rows = [[d, str(t), f"{m * 100 // t}%"] for d, t, m in zip(depts, total, male)]
    note = ("The table below shows the total number of employees in five departments of a company and the "
            "percentage of them who are male. Study the data and answer the questions.")
    i, j = random.sample(range(5), 2)
    from math import gcd
    g = gcd(male[i], female[i]) or 1
    pct = Decimal(female[i]) / total[i] * 100
    return _di_pack(
        "Data Interpretation", note, ["Department", "Total employees", "Male %"], rows,
        [
            (f"How many female employees are there in {depts[i]} and {depts[j]} together?",
             _money(female[i] + female[j]),
             [_money(male[i] + male[j]), _money(female[i]), _money(female[j]),
              _money(abs(female[i] - female[j]))],
             f"{depts[i]}: {total[i]} total, {male[i] * 100 // total[i]}% male, so female = {female[i]}. "
             f"{depts[j]}: {total[j]} total, {male[j] * 100 // total[j]}% male, so female = {female[j]}. "
             f"Together = {female[i] + female[j]}."),
            (f"Find the ratio of male to female employees in {depts[i]}.", f"{male[i]//g} : {female[i]//g}",
             [f"{female[i]//g} : {male[i]//g}", "1 : 1", f"{male[i]} : {female[i] + 10}",
              f"{male[i]//g + 1} : {female[i]//g}"],
             f"Ratio = {male[i]} : {female[i]} = {male[i]//g} : {female[i]//g}."),
            (f"What is the total number of male employees in {depts[i]} and {depts[j]} together?",
             _money(male[i] + male[j]),
             [_money(female[i] + female[j]), _money(abs(male[i] - male[j])), _money(male[i]), _money(male[j])],
             f"Male in {depts[i]} = {male[i]}, in {depts[j]} = {male[j]}. Total = {male[i] + male[j]}."),
            ("What is the average number of employees per department?", _money(Decimal(sum(total)) / 5),
             [_money(sum(total)), _money(Decimal(sum(male)) / 5), _money(Decimal(sum(female)) / 5),
              _money(Decimal(sum(total)) / 4)],
             f"Total = {sum(total)}. Average = {sum(total)}/5 = {_money(Decimal(sum(total)) / 5)}."),
            (f"By how many does the number of employees in {depts[i]} differ from that in {depts[j]}?",
             _money(abs(total[i] - total[j])),
             [_money(total[i] + total[j]), _money(total[i]), _money(total[j]), _money(abs(total[i] - total[j]) * 2)],
             f"Difference = |{total[i]} − {total[j]}| = {abs(total[i] - total[j])}."),
        ],
    )


def di_caselet_set():
    """Caselet: the data is in prose, with nothing tabulated."""
    total = random.choice([1200, 1500, 1800, 2400])
    p_cricket = random.choice([30, 35, 40, 45])
    p_football = random.choice([20, 25, 30])
    cricket = total * p_cricket // 100
    football = total * p_football // 100
    tennis = total - cricket - football
    boys_c = cricket * random.choice([50, 60, 70]) // 100
    girls_c = cricket - boys_c
    note = (f"In a school of {total:,} students, {p_cricket}% play cricket and {p_football}% play football, "
            f"while the rest play tennis. Among the cricket players, {boys_c * 100 // cricket}% are boys. "
            f"Answer the questions using this information.")
    from math import gcd
    g = gcd(cricket, football) or 1
    return _di_pack(
        # A caselet has NO table by definition — the whole skill is pulling the
        # numbers out of the prose. Listing Cricket/Football/Tennis counts here
        # answered three of the five questions outright.
        "Data Interpretation", note, [], [],
        [
            ("How many students play tennis?", _money(tennis),
             [_money(cricket), _money(football), _money(cricket + football), _money(tennis * 2)],
             f"Cricket = {cricket}, Football = {football}. Tennis = {total} − {cricket} − {football} = {tennis}."),
            ("Find the ratio of cricket players to football players.", f"{cricket//g} : {football//g}",
             [f"{football//g} : {cricket//g}", f"{p_cricket} : {p_football}", "1 : 1",
              f"{cricket//g + 1} : {football//g}"],
             f"Ratio = {cricket} : {football} = {cricket//g} : {football//g}."),
            ("How many girls play cricket?", _money(girls_c),
             [_money(boys_c), _money(cricket), _money(girls_c * 2), _money(abs(boys_c - girls_c))],
             f"Cricket players = {cricket}, of whom boys = {boys_c}. Girls = {cricket} − {boys_c} = {girls_c}."),
            ("Cricket players are what percent more than football players? (rounded to two decimals)",
             f"{_money(Decimal(cricket - football) / football * 100)}%",
             [f"{_money(Decimal(cricket - football) / cricket * 100)}%", f"{p_cricket - p_football}%",
              f"{_money(Decimal(cricket) / football * 100)}%", f"{_money(Decimal(football) / cricket * 100)}%"],
             f"({cricket} − {football})/{football} × 100 = {_money(Decimal(cricket - football) / football * 100)}%."),
            ("What is the average number of students per sport?", _money(Decimal(total) / 3),
             [_money(total), _money(Decimal(total) / 2), _money(cricket), _money(Decimal(total) / 4)],
             f"Total = {total} across 3 sports. Average = {total}/3 = {_money(Decimal(total) / 3)}."),
        ],
    )


# Five chart types; a paper draws 2-3 of them at random so no two mocks open the
# same way. Pie and bar are the most common in the real paper, hence weighted.
DI_SETS = [di_pie_set, di_bar_set, di_line_set, di_table_set, di_caselet_set]


# Only PO-level, multi-step generators ship. The one-step drills below
# ("What is 20% of 400?", "find the interest on ₹5000") are deliberately NOT in
# this pool — a real SBI/IBPS PO paper chains three to five steps, so a
# single-step item is worse than no item: it teaches the wrong pacing and
# flatters the score. They stay in the file only as building blocks.
def work_leaves_midway():
    """A and B start together, A leaves, B finishes the rest — three steps."""
    a = random.choice([12, 15, 18, 20, 24, 30])
    b = random.choice([20, 24, 30, 36, 40, 60])
    while b == a:
        b = random.choice([20, 30, 40, 60])
    together = Decimal(a * b) / (a + b)
    days = random.choice([d for d in (3, 4, 5, 6) if d < together]) if together > 3 else 2
    done = Decimal(days) * (Decimal(1) / a + Decimal(1) / b)
    left = 1 - done
    rest = left * b
    total = Decimal(days) + rest
    return _pack(
        "Time and Work",
        f"A can complete a piece of work in {a} days and B in {b} days. They begin together, but A leaves after "
        f"{days} days. In how many days will the whole work be completed?",
        _money(total),
        [_money(rest), _money(together), _money(Decimal(days) + b), _money(total + days)],
        f"In {days} days together they finish {days}({_money(Decimal(1) / a * 100)}% + "
        f"{_money(Decimal(1) / b * 100)}%) = {_money(done * 100)}% of the work. The remaining "
        f"{_money(left * 100)}% is done by B alone in {_money(left)} × {b} = {_money(rest)} days. "
        f"Total = {days} + {_money(rest)} = {_money(total)} days.",
        "Work out the FRACTION completed before A leaves — then only B's rate matters.",
        "Hard",
    )


def pipes_with_outlet_opened_late():
    """Both inlets run, then an outlet is opened — the classic PO variant."""
    f1 = random.choice([10, 12, 15, 20])
    f2 = random.choice([15, 20, 24, 30])
    out = random.choice([30, 40, 60])
    r_in = Decimal(1) / f1 + Decimal(1) / f2
    r_net = r_in - Decimal(1) / out
    t_in = 1 / r_in
    t_net = 1 / r_net
    return _pack(
        "Pipes and Cisterns",
        f"Two pipes can fill a tank in {f1} and {f2} hours respectively, while an outlet pipe can empty the full "
        f"tank in {out} hours. If all three are opened together, in how many hours will the tank be filled?",
        _money(t_net),
        [_money(t_in), _money(f1 + f2), _money(t_net / 2), _money(out - f1)],
        f"Combined inlet rate = 1/{f1} + 1/{f2} = {_money(r_in)} of the tank per hour. The outlet removes "
        f"1/{out}, so the net rate = {_money(r_net)} per hour. Time = 1 ÷ {_money(r_net)} = {_money(t_net)} hours.",
        "Add the inlet rates, SUBTRACT the outlet, then invert once at the end.",
        "Hard",
    )


GENERATORS = {
    "Problems on Ages": [ages_ratio_relation, ages_present_future],
    "Quadratic Equations": [quadratic_comparison],
    "Mixture and Alligation": [mixture_replacement, alligation_ratio, mixture_ratio_after_addition],
    "Time and Work": [work_leaves_midway],
    "Pipes and Cisterns": [pipes_with_outlet_opened_late],
    "Boats and Streams": [boats_quantity_comparison],
    "Partnership": [partnership_delayed_join],
    "Compound Interest": [si_ci_combined],
    "Percentage": [successive_percentage_salary],
    "Profit and Loss": [profit_markup_discount, profit_two_articles],
    "Approximation": [approximation_multi_term, approximation_percentage_chain, approximation_fraction_mix],
    "Number Series": [number_series_missing, number_series_wrong_term],
}

# The blueprint the strategy panel promises, for a 35-question Quant section.
# Picking a topic uniformly at random ignored these entirely: a real paper came
# out with 5 Ages, 5 Quadratics and NO Number Series at all, against a panel
# telling the candidate to expect 5 of them. Counts scale with section length.
QUANT_BLUEPRINT = [
    ("Data Interpretation", 10),   # 2-3 sets, filled by DI_SETS below
    ("Approximation", 5),
    ("Number Series", 5),
    ("Quadratic Equations", 5),
    # The remaining ~11 are arithmetic word problems, spread across these topics
    # so no single one dominates the way Ages did.
    ("__arithmetic__", 10),
]

ARITHMETIC_TOPICS = [
    "Problems on Ages", "Mixture and Alligation", "Time and Work",
    "Pipes and Cisterns", "Boats and Streams", "Partnership",
    "Compound Interest", "Percentage", "Profit and Loss",
]

# Retired from the pool for being single-step: percentage_of, profit_percent,
# simple_interest, average_basic, train_crosses_pole, speed_distance_time,
# boats_and_streams, partnership_profit.


def generate(n: int, topics=None) -> list:
    """n deterministic Quant questions, spread across the topic pool.

    Duplicates are avoided by stem, so a paper never repeats a question even
    when the same generator is drawn twice.
    """
    # Pick a TOPIC first, then a generator within it. Choosing uniformly from a
    # flat list of functions let topics that happen to have three generators
    # take three times the share — a 35-question section came out with 9
    # Approximation and 1 Simple Interest.
    names = [t for t in GENERATORS if not topics or t in topics]
    if not names:
        return []

    out, seen = [], set()

    # How many questions any ONE template may contribute. Deduping on exact text
    # let the same generator run twice with different numbers, which reads as a
    # near-duplicate: "A man spends 15%... saves 21600" followed immediately by
    # "A man spends 18%... saves 19440". Templates whose shape genuinely varies
    # per draw (the equations in a quadratic set, the rule behind a series) are
    # allowed more.
    # A real paper genuinely does carry five quadratic sets in one format, and
    # number series vary by their underlying rule — those may repeat. A word
    # problem may not: four "A in 20 days, B in 36 days, A leaves after 5" in a
    # row is the same question four times.
    TEMPLATE_CAP = {
        "quadratic_comparison": 5,
        "number_series_missing": 3,
        "number_series_wrong_term": 3,
        "approximation_multi_term": 2,
        "approximation_percentage_chain": 2,
        "approximation_fraction_mix": 2,
    }
    DEFAULT_CAP = 1
    used = collections.Counter()

    def take(topic, want):
        """Add up to `want` questions from one topic, skipping duplicates."""
        pool = GENERATORS.get(topic)
        if not pool or (topics and topic not in topics):
            return
        got, guard = 0, 0
        while got < want and len(out) < n and guard < want * 60:
            guard += 1
            fn = random.choice(pool)
            cap = TEMPLATE_CAP.get(fn.__name__, DEFAULT_CAP)
            if used[fn.__name__] >= cap:
                if all(used[f.__name__] >= TEMPLATE_CAP.get(f.__name__, DEFAULT_CAP) for f in pool):
                    return                     # this topic is exhausted
                continue
            q = fn()
            if q["question"] in seen:
                continue
            seen.add(q["question"])
            used[fn.__name__] += 1
            out.append(q)
            got += 1

    # Follow the blueprint the strategy panel shows the candidate, scaled to the
    # requested length. Uniform random selection produced papers with 5 Ages,
    # 5 Quadratics and zero Number Series while the panel promised 5 of them.
    scale = n / 35.0
    for topic, count in QUANT_BLUEPRINT:
        want = max(1, round(count * scale)) if count else 0
        if topic == "Data Interpretation":
            # 2-3 sets of five, drawn from the five chart types.
            if n >= 20:
                for build in random.sample(DI_SETS, 2 if want <= 10 else 3):
                    for q in build():
                        if len(out) < n and q["question"] not in seen:
                            seen.add(q["question"])
                            out.append(q)
        elif topic == "__arithmetic__":
            # Spread across the arithmetic topics rather than letting one repeat.
            order = [t for t in ARITHMETIC_TOPICS if not topics or t in topics]
            random.shuffle(order)
            per = max(1, want // max(1, len(order)))
            for t in order:
                take(t, per)
            i = 0
            while len(out) < n and i < len(order) * 4:      # top up round-robin
                take(order[i % len(order)], 1)
                i += 1
        else:
            take(topic, want)

    # Anything still short (a topic exhausted its variations) is filled from the
    # arithmetic pool so the section is never returned under-length.
    i = 0
    pool = [t for t in ARITHMETIC_TOPICS if not topics or t in topics] or names
    while len(out) < n and i < n * 8:
        take(pool[i % len(pool)], 1)
        i += 1
    return out
