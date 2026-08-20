"""Deterministic English question generator for the IBPS/SBI PO mock.

Same principle as quant_generator.py: the server owns the answer rather than
asking a language model for one. Two of these formats are correct by
construction — a rearrangement question is built by taking a sentence that is
already correct, splitting it and shuffling the pieces, so the key is the
original order and cannot be wrong. The rest draw on curated banks where the
correct usage is recorded alongside the sentence.

Formats mirror what SBI PO actually asks:
  - Phrasal verb usage: three sentences, pick the ones using the verb correctly
  - Error detection: a sentence in four parts, name the faulty part
  - Double fillers: two blanks, pick the pair that fits both
  - Sentence rearrangement: fragments of one sentence, restore the order
  - Word swap: three words misplaced in a sentence, give the correct order
"""
import random

from .quant_generator import _pack


# ── Phrasal verbs ─────────────────────────────────────────────────────────────
# Each entry: the verb, its real senses, and sentences flagged correct/incorrect.
# An incorrect sentence uses the verb in a sense it does not carry — the exact
# trap SBI sets ("call off her friend" for telephone, which is "call up").
PHRASAL_VERBS = [
    ("look into", "to investigate", [
        ("The manager promised to look into the matter and report back by Friday.", True),
        ("The police were asked to look into the suspicious activity near the warehouse.", True),
        ("She looked into the mirror before leaving for the interview.", False),
    ], "\"Look into\" means to investigate. Looking AT one's reflection is simply \"looked in/at the mirror\"."),

    ("call off", "to cancel", [
        ("The organizers had to call off the event due to heavy rainfall.", True),
        ("The workers agreed to call off the strike once their demands were met.", True),
        ("She decided to call off her friend to ask about the homework.", False),
    ], "\"Call off\" means to cancel. Telephoning someone is \"call up\" or simply \"call\"."),

    ("put down", "to record; to belittle; to suppress", [
        ("The teacher asked the students to put down their pens and listen carefully.", True),
        ("He tried to put down his colleague's idea in front of everyone during the meeting.", True),
        ("The rebellion was quickly put down by the government forces.", True),
    ], "All three are genuine senses: to set down in writing, to belittle, and to suppress."),

    ("carry out", "to perform or execute", [
        ("The team will carry out a detailed survey next month.", True),
        ("The orders were carried out without any delay.", True),
        ("He carried out the heavy box to the truck.", False),
    ], "\"Carry out\" means to execute a task. Physically transporting something out is just \"carried the box out\"."),

    ("break down", "to stop functioning; to lose composure; to analyse", [
        ("The car broke down on the highway during the storm.", True),
        ("She broke down when she heard the news.", True),
        ("The committee broke down the budget into six categories.", True),
    ], "All three are standard: machinery failing, emotional collapse, and separating into parts."),

    ("turn down", "to reject; to reduce", [
        ("He turned down the job offer despite the high salary.", True),
        ("Please turn down the volume, the baby is sleeping.", True),
        ("She turned down the street and walked towards the market.", False),
    ], "\"Turn down\" means to reject or to reduce. Changing direction is \"turned into/onto the street\"."),

    ("give in", "to yield or surrender", [
        ("After hours of argument, he finally gave in to their demands.", True),
        ("The students refused to give in to the pressure.", True),
        ("Please give in your assignments by Monday.", False),
    ], "\"Give in\" means to yield. Submitting work is \"hand in\" or \"submit\"."),

    ("bring about", "to cause to happen", [
        ("The new policy brought about a significant change in the industry.", True),
        ("Technology has brought about a shift in how we communicate.", True),
        ("He brought about his brother to the party.", False),
    ], "\"Bring about\" means to cause. Bringing a person somewhere is \"brought along\"."),
]


def phrasal_verb_usage():
    verb, sense, sentences, why = random.choice(PHRASAL_VERBS)
    picked = list(sentences)
    random.shuffle(picked)
    labels = "ABC"
    correct = [labels[i] for i, (_, ok) in enumerate(picked) if ok]

    def phrase(ls):
        if len(ls) == 3:
            return "All (A), (B) and (C)"
        if len(ls) == 2:
            return f"Only ({ls[0]}) and ({ls[1]})"
        if len(ls) == 1:
            return f"Only ({ls[0]})"
        return "None of these"

    answer = phrase(correct)
    pool = ["Only (A)", "Only (B)", "Only (C)", "Only (A) and (B)", "Only (A) and (C)",
            "Only (B) and (C)", "All (A), (B) and (C)", "None of these"]
    distractors = [p for p in pool if p != answer]
    random.shuffle(distractors)

    body = "\n".join(f"({labels[i]}) {s}" for i, (s, _) in enumerate(picked))
    return _pack(
        "Phrasal Verbs",
        f"In the sentences below, the phrasal verb \"{verb}\" has been used. Identify the sentence(s) in which "
        f"it has been used CORRECTLY.\n\n{body}",
        answer, distractors[:4],
        f"\"{verb}\" means {sense}. {why} Correct usage: {', '.join(f'({c})' for c in correct) or 'none'}.",
        f"Test each sentence against the verb's real sense, not against what sounds familiar.",
        "Moderate",
    )


# ── Error detection ───────────────────────────────────────────────────────────
# Each entry is the four parts, the index of the faulty one (or None), and why.
ERROR_SENTENCES = [
    (["The Bengal tiger population", "has increased more", "rapidly than that",
      "of any other big cat species in India."], None,
     "The comparison is complete and the verb agrees with the singular 'population'. No error."),
    (["The Bengal tiger population", "has increased more", "rapidly than that",
      "of big cat species in India."], 3,
     "An incomplete comparison — 'than that of big cat species' must be 'than that of ANY OTHER big cat species'."),
    (["The city council announced", "that new recycling bins would be", "installed across all",
      "major residential neighborhoods."], None,
     "Reported speech, passive voice and the preposition are all correct. No error."),
    (["Each of the students", "have submitted", "their assignment", "before the deadline."], 1,
     "'Each of the students' is singular, so it takes 'HAS submitted', not 'have'."),
    (["The number of applicants", "for the post were", "much higher", "than expected."], 1,
     "'The number of' takes a singular verb — 'WAS much higher', not 'were'."),
    (["Neither the manager", "nor the employees", "was aware", "of the new policy."], 2,
     "With 'neither...nor', the verb agrees with the nearer subject 'employees', so it must be 'WERE aware'."),
    (["She is one of", "the few candidates", "who has cleared", "the examination."], 2,
     "'One of the few candidates who' takes a plural verb — 'who HAVE cleared'."),
    (["The committee has", "submitted its report", "to the chairman", "yesterday evening."], 0,
     "'Yesterday' requires the simple past, so 'has submitted' must be 'SUBMITTED'."),
    (["He has been working", "in this organisation", "since the last", "five years."], 2,
     "'Since' marks a point in time; a duration takes 'FOR the last five years'."),
    (["The scenery of Kashmir", "are so beautiful", "that tourists visit it", "throughout the year."], 1,
     "'Scenery' is uncountable and takes a singular verb — 'IS so beautiful'."),
]


def error_detection():
    parts, bad, why = random.choice(ERROR_SENTENCES)
    labels = "ABCD"
    body = " / ".join(f"{p} ({labels[i]})" for i, p in enumerate(parts))
    answer = "No Error" if bad is None else labels[bad]
    distractors = [l for l in labels if l != answer] + (["No Error"] if bad is not None else [])
    return _pack(
        "Error Detection",
        f"Find the part of the sentence that contains an error. If there is no error, choose 'No Error'.\n\n{body}",
        answer, distractors[:4], why,
        "Check subject-verb agreement, tense markers and comparison structure first — that is where the error usually is.",
        "Moderate",
    )


# ── Double fillers ────────────────────────────────────────────────────────────
FILLER_ITEMS = [
    ("The government's push for cashless transactions gained ______ as digital payment platforms reported a "
     "______ surge in user registrations.",
     ("momentum", "significant"),
     [("criticism", "minor"), ("resistance", "sharp"), ("opposition", "gradual"), ("support", "declining")],
     "The sentence describes growth, so the push gained MOMENTUM and the surge was SIGNIFICANT. "
     "'Resistance' and 'opposition' contradict a surge, and 'declining surge' is self-contradictory."),

    ("The Centre ______ the scope of the AIF scheme to make it more attractive, as part of its objective to "
     "______ farm-related infrastructure in the country.",
     ("expanded", "strengthen"),
     [("widened", "restrict"), ("extend", "develop"), ("limited", "reduce"), ("broadened", "weaken")],
     "Making a scheme more attractive means the scope was EXPANDED, and the aim is to STRENGTHEN "
     "infrastructure. 'Extend, develop' fails only on tense — the sentence needs a past form."),

    ("Crude oil prices posted a weekly ______ weighed down by ongoing demand ______ from major oil markets.",
     ("loss", "concerns"),
     [("gain", "fears"), ("drop", "anxious"), ("rebound", "relief"), ("declined", "doubts")],
     "'Weighed down' signals a fall, so prices posted a LOSS driven by demand CONCERNS. 'Gain' and 'rebound' "
     "contradict it; 'anxious' is an adjective where a noun is needed; 'declined' is the wrong part of speech."),

    ("The report ______ that rural consumption has begun to ______ after two weak quarters.",
     ("indicates", "recover"),
     [("denies", "improve"), ("suggested", "declining"), ("states", "worsen"), ("questions", "rebound")],
     "A report INDICATES a finding, and after weak quarters consumption would RECOVER. 'Worsen' contradicts "
     "'begun to' in a positive frame, and 'declining' is the wrong form after 'to'."),

    ("Despite ______ opposition from local traders, the civic body went ______ with the redevelopment plan.",
     ("stiff", "ahead"),
     [("mild", "back"), ("strong", "behind"), ("weak", "forward"), ("harsh", "away")],
     "'Despite' sets up a contrast, so the opposition was STIFF yet the body went AHEAD. 'Went back' and "
     "'went away' reverse the meaning."),
]


def double_fillers():
    sentence, right, wrong, why = random.choice(FILLER_ITEMS)
    fmt = lambda pr: f"{pr[0]}, {pr[1]}"
    return _pack(
        "Double Fillers",
        f"Choose the pair of words that fits BOTH blanks appropriately.\n\n{sentence}",
        fmt(right), [fmt(w) for w in wrong], why,
        "Fix whichever blank is more constrained first, then use it to eliminate pairs.",
        "Moderate",
    )


# ── Sentence rearrangement ────────────────────────────────────────────────────
# Correct by construction: a sentence known to be correct is split into
# fragments, shuffled for display, and the key is the original order.
REARRANGE_SENTENCES = [
    ["the philosopher argued", "that genuine happiness", "stems from meaningful",
     "relationships rather than", "material wealth"],
    ["the committee concluded", "that the new policy", "would benefit small",
     "businesses far more", "than large corporations"],
    ["recent studies suggest", "that regular exercise", "improves cognitive function",
     "in adults more", "than any supplement"],
    ["the central bank warned", "that rising inflation", "could slow economic",
     "growth considerably over", "the coming year"],
    ["the researchers found", "that early intervention", "reduces long-term costs",
     "for healthcare systems", "across most countries"],
]


def sentence_rearrangement():
    correct = random.choice(REARRANGE_SENTENCES)
    labels = "ABCDE"[:len(correct)]
    order = list(range(len(correct)))
    shown = order[:]
    while shown == order:
        random.shuffle(shown)
    # shown[i] = which original fragment is displayed under label i
    display = [(labels[i], correct[shown[i]]) for i in range(len(correct))]
    # the answer is the labels in the order that rebuilds the original sentence
    answer = "".join(labels[shown.index(k)] for k in order)

    wrong = set()
    while len(wrong) < 4:
        cand = "".join(random.sample(labels, len(labels)))
        if cand != answer:
            wrong.add(cand)

    body = "\n".join(f"{l}. {t}" for l, t in display)
    return _pack(
        "Sentence Rearrangement",
        f"Rearrange the following parts to form a meaningful sentence.\n\n{body}",
        answer, sorted(wrong),
        f"The correct sentence reads: \"{' '.join(correct).capitalize()}.\" — giving the order {answer}.",
        "Find the fragment carrying the subject and main verb; that almost always opens the sentence.",
        "Moderate",
    )


# ── Word swap ─────────────────────────────────────────────────────────────────
# Three words are lifted out of a correct sentence and printed in the wrong
# slots; the candidate names the order that restores it.
SWAP_SENTENCES = [
    ("In the busy {}, he noticed the abandoned {} and informed the {} before anyone else reacted.",
     ["marketplace", "bag", "security"]),
    ("Many students {} without proper {} leads to disappointing {} in competitive tests.",
     ["struggle because effort", "guidance", "results"]),
    ("The {} announced that the {} would be repaired before the {} season begins.",
     ["council", "roads", "monsoon"]),
    ("She kept the {} in the drawer, locked the {} and handed the {} to her colleague.",
     ["documents", "cabinet", "keys"]),
]


def word_swap():
    template, words = random.choice(SWAP_SENTENCES)
    labels = "ABC"
    order = list(range(3))
    shown = order[:]
    while shown == order:
        random.shuffle(shown)
    displayed = [words[shown[i]] for i in range(3)]
    sentence = template.format(*[f"{w} ({labels[i]})" for i, w in enumerate(displayed)])
    answer = "".join(labels[shown.index(k)] for k in order)

    wrong = set()
    while len(wrong) < 4:
        cand = "".join(random.sample(labels, 3))
        if cand != answer:
            wrong.add(cand)
    opts = sorted(wrong)[:3] + ["No rearrangement required"]

    return _pack(
        "Word Swap",
        f"Three words in the sentence below have been placed in the wrong positions. Choose the order that "
        f"makes the sentence meaningful.\n\n{sentence}",
        answer, opts,
        f"Restoring the words gives: \"{template.format(*words)}\" — order {answer}.",
        "Read the sentence for sense first; the noun that obviously belongs to a verb usually fixes one slot immediately.",
        "Moderate",
    )


GENERATORS = {
    "Phrasal Verbs": [phrasal_verb_usage],
    "Error Detection": [error_detection],
    "Double Fillers": [double_fillers],
    "Sentence Rearrangement": [sentence_rearrangement],
    "Word Swap": [word_swap],
}


def generate(n: int) -> list:
    """n deterministic English questions, spread across the five formats."""
    names = list(GENERATORS)
    out, seen, guard = [], set(), 0
    while len(out) < n and guard < n * 60:
        guard += 1
        q = random.choice(GENERATORS[random.choice(names)])()
        if q["question"] in seen:
            continue
        seen.add(q["question"])
        out.append(q)
    return out
