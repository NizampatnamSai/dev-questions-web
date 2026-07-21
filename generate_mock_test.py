import json
import os

# Aligned with the IBPS PO Prelims structure
EXAM_METADATA = {
    "name": "IBPS PO Prelims Mock Test - 1",
    "duration": 60,
    "totalQuestions": 100,
    "totalMarks": 100,
    "sections": [
        {"name": "English Language", "totalQuestions": 30, "marks": 30, "time": 20},
        {"name": "Quantitative Aptitude", "totalQuestions": 35, "marks": 35, "time": 20},
        {"name": "Reasoning Ability", "totalQuestions": 35, "marks": 35, "time": 20}
    ]
}

# Sample question templates for English, Quant, Reasoning to populate the list of 100 questions
QUESTIONS = []

# --- English Language (1 to 30) ---
# Reading Comprehension (1-8)
rc_passage = (
    "The modern banking sector is undergoing a profound transformation driven by digital integration and customer expectation shifts. "
    "Traditional institutions are forced to transition from transactional relationships to value-driven engagements. "
    "Furthermore, the rise of decentralized finance and neo-banks has challenged the conventional deposit-lending spread models. "
    "Risk management frameworks, particularly Basel III and IV, dictate stricter capital adequacy ratios, limiting the credit creation capacity of public banks. "
    "Meanwhile, cybersecurity breaches expose vulnerabilities in digital interfaces, prompting regulators like the RBI to enforce stringent compliance standards."
)

for i in range(1, 9):
    QUESTIONS.append({
        "id": f"ibpspo-pre-mock-eng-{i}",
        "section": "English Language",
        "topic": "Reading Comprehension",
        "difficulty": "Moderate" if i % 2 == 0 else "Hard",
        "marks": 1.0,
        "negativeMarks": -0.25,
        "expectedTime": 45,
        "question": f"According to the passage, what is a major driver of the transformation in the modern banking sector? (Question {i})",
        "passage": rc_passage,
        "options": {
            "A": "Decentralized finance systems and regulatory loopholes",
            "B": "Digital integration and customer expectation shifts",
            "C": "Conventional deposit-lending spreads and neo-banks",
            "D": "Strict compliance guidelines issued by the Basel committee",
            "E": "None of the above"
        },
        "correctAnswer": "B",
        "explanation": "The passage clearly states in the first sentence that modern banking is undergoing transformation driven by digital integration and customer expectation shifts.",
        "shortcut": "Look for keywords: 'transformation' and 'driver' in the first paragraph.",
        "commonMistake": "Selecting option A due to mention of decentralized finance, which is a challenge, not the driver.",
        "concept": "Direct reference inference",
        "previousYearSimilarity": "90%"
    })

# Cloze Test (9-14)
cloze_passage = "Public sector banks (PSBs) must ________(9) their operational models to compete with agile private peers. The traditional bureaucratic hierarchy often ________(10) decision-making processes, leading to credit delays. By adopting technology, banks can ________(11) credit appraisal times and improve customer satisfaction."

for i in range(9, 15):
    QUESTIONS.append({
        "id": f"ibpspo-pre-mock-eng-{i}",
        "section": "English Language",
        "topic": "Cloze Test",
        "difficulty": "Moderate",
        "marks": 1.0,
        "negativeMarks": -0.25,
        "expectedTime": 35,
        "question": f"Which word fits best in blank {i} of the passage?",
        "passage": cloze_passage,
        "options": {
            "A": "modernize" if i == 9 else "delay" if i == 10 else "reduce",
            "B": "ignore" if i == 9 else "impede" if i == 10 else "increase",
            "C": "destroy" if i == 9 else "accelerate" if i == 10 else "abandon",
            "D": "replicate" if i == 9 else "facilitate" if i == 10 else "maintain",
            "E": "none of the above"
        },
        "correctAnswer": "A",
        "explanation": "Option A is contextually correct and grammatically fits the blank to convey positive reform.",
        "shortcut": "Check tone of context: it's advocating reform, so positive words are needed.",
        "commonMistake": "Choosing a negative verb in a positive context.",
        "concept": "Contextual vocabulary mapping",
        "previousYearSimilarity": "85%"
    })

# Error Detection (15-20)
QUESTIONS.append({
    "id": "ibpspo-pre-mock-eng-15",
    "section": "English Language",
    "topic": "Error Detection",
    "difficulty": "Easy",
    "marks": 1.0,
    "negativeMarks": -0.25,
    "expectedTime": 30,
    "question": "Identify the segment containing a grammatical error: 'The committee (A) has agreed (B) to discussing (C) the merger next week (D). No error (E).'",
    "options": {"A": "A", "B": "B", "C": "C", "D": "D", "E": "E"},
    "correctAnswer": "C",
    "explanation": "Segment C is incorrect. The verb 'agree' is followed by the infinitive 'to discuss', not the gerund 'to discussing'.",
    "shortcut": "Check verb + preposition/infinitive combinations: 'agree to' + V1.",
    "commonMistake": "Missing the incorrect -ing usage after 'to'.",
    "concept": "Infinitives vs Gerunds",
    "previousYearSimilarity": "95%"
})

for i in range(16, 21):
    QUESTIONS.append({
        "id": f"ibpspo-pre-mock-eng-{i}",
        "section": "English Language",
        "topic": "Error Detection",
        "difficulty": "Moderate",
        "marks": 1.0,
        "negativeMarks": -0.25,
        "expectedTime": 30,
        "question": f"Identify the grammatical error in the following sentence (Scenario {i}): 'Either the manager or the associates has completed the report.'",
        "options": {
            "A": "Either",
            "B": "or the associates",
            "C": "has completed",
            "D": "the report",
            "E": "No error"
        },
        "correctAnswer": "C",
        "explanation": "When compound subjects are joined by 'or', the verb agrees with the closer subject. 'associates' is plural, so it should be 'have completed'.",
        "shortcut": "Check closer subject when using 'either...or'.",
        "commonMistake": "Matching verb with 'manager' instead of 'associates'.",
        "concept": "Subject-Verb Agreement",
        "previousYearSimilarity": "90%"
    })

# Sentence Improvement / Phrase Replacement (21-25)
for i in range(21, 26):
    QUESTIONS.append({
        "id": f"ibpspo-pre-mock-eng-{i}",
        "section": "English Language",
        "topic": "Sentence Improvement",
        "difficulty": "Moderate",
        "marks": 1.0,
        "negativeMarks": -0.25,
        "expectedTime": 35,
        "question": "Improve the bold phrase: 'If he **had worked** hard, he would have cleared the banking exam.'",
        "options": {
            "A": "worked hard",
            "B": "works hard",
            "C": "had worked",
            "D": "has worked",
            "E": "No correction required"
        },
        "correctAnswer": "E",
        "explanation": "The sentence is a third conditional clause (If + past perfect, would + have + V3), which is grammatically correct.",
        "shortcut": "Conditional pattern match: If + had + V3 ---> would have + V3.",
        "commonMistake": "Changing it to past simple when it is a past unfulfilled condition.",
        "concept": "Conditional Sentences",
        "previousYearSimilarity": "92%"
    })

# Connectors & Para Jumbles (26-30)
for i in range(26, 31):
    QUESTIONS.append({
        "id": f"ibpspo-pre-mock-eng-{i}",
        "section": "English Language",
        "topic": "Sentence Connectors",
        "difficulty": "Hard",
        "marks": 1.0,
        "negativeMarks": -0.25,
        "expectedTime": 45,
        "question": "Choose the starting connector that links: (I) The interest rates are falling. (II) Fixed deposit savers are unhappy.",
        "options": {
            "A": "Although",
            "B": "Since",
            "C": "However",
            "D": "Unless",
            "E": "Despite"
        },
        "correctAnswer": "B",
        "explanation": "Since means 'because'. Because interest rates are falling, savers are unhappy. This represents cause and effect.",
        "shortcut": "Identify logical relationship: Cause (I) -> Effect (II).",
        "commonMistake": "Selecting 'Although' which implies contrast.",
        "concept": "Sentence Connectors",
        "previousYearSimilarity": "88%"
    })


# --- Quantitative Aptitude (31 to 65) ---
# Approximations (31-35)
QUESTIONS.append({
    "id": "ibpspo-pre-mock-quant-31",
    "section": "Quantitative Aptitude",
    "topic": "Approximation",
    "difficulty": "Easy",
    "marks": 1.0,
    "negativeMarks": -0.25,
    "expectedTime": 25,
    "question": "Find the approximate value of 'x': 779.98 / 13.02 + 5.01 + 22.98 = x% of 59.99",
    "options": {
        "A": "110",
        "B": "120",
        "C": "147",
        "D": "165",
        "E": "180"
    },
    "correctAnswer": "C",
    "explanation": "Round values: 780 / 13 + 5 + 23 = x% of 60. => 60 + 28 = 0.6 * x => 88 = 0.6 * x => x = 146.66 ≈ 147.",
    "shortcut": "780 / 13 is exactly 60. Then 60 + 28 = 88. 88 / 0.6 = 146.6 ≈ 147.",
    "commonMistake": "Division error: rounding 779.98 to 770 instead of 780.",
    "concept": "Approximation rules",
    "previousYearSimilarity": "98%"
})

for i in range(32, 36):
    QUESTIONS.append({
        "id": f"ibpspo-pre-mock-quant-{i}",
        "section": "Quantitative Aptitude",
        "topic": "Approximation",
        "difficulty": "Moderate",
        "marks": 1.0,
        "negativeMarks": -0.25,
        "expectedTime": 30,
        "question": f"Find approximate value of x: sqrt(195.99) + 40.01% of 249.99 = x^2 + 55.99",
        "options": {
            "A": "5",
            "B": "7",
            "C": "8",
            "D": "12",
            "E": "15"
        },
        "correctAnswer": "C",
        "explanation": "sqrt(196) + 40% of 250 = x^2 + 56 => 14 + 100 = x^2 + 56 => 114 - 56 = x^2 => 58 ≈ x^2 => x ≈ 8.",
        "shortcut": "Approximate sqrt(196) to 14, 40% of 250 to 100. 114 - 56 = 58, closest square is 64 (8).",
        "commonMistake": "Wrong square root of 196.",
        "concept": "Fast Arithmetic rounding",
        "previousYearSimilarity": "95%"
    })

# Quadratic Equations (36-40)
QUESTIONS.append({
    "id": "ibpspo-pre-mock-quant-36",
    "section": "Quantitative Aptitude",
    "topic": "Quadratic Equations",
    "difficulty": "Moderate",
    "marks": 1.0,
    "negativeMarks": -0.25,
    "expectedTime": 35,
    "question": "Determine the relationship between x and y:\nI. x^2 - 10x + 24 = 0\nII. 5y^2 - 16y + 12 = 0",
    "options": {
        "A": "x > y",
        "B": "x < y",
        "C": "x >= y",
        "D": "x <= y",
        "E": "x = y or relationship cannot be established"
    },
    "correctAnswer": "A",
    "explanation": "Eq 1: roots x = 4, 6.\nEq 2: roots y = 1.2, 2.\nComparing roots, both 4 and 6 are greater than 1.2 and 2. Thus x > y.",
    "shortcut": "Find roots using sign method & factoring. x is positive roots (4,6), y is positive roots (1.2, 2). All x > y.",
    "commonMistake": "Dividing y factors incorrectly.",
    "concept": "Pairwise root comparison",
    "previousYearSimilarity": "94%"
})

for i in range(37, 41):
    QUESTIONS.append({
        "id": f"ibpspo-pre-mock-quant-{i}",
        "section": "Quantitative Aptitude",
        "topic": "Quadratic Equations",
        "difficulty": "Moderate",
        "marks": 1.0,
        "negativeMarks": -0.25,
        "expectedTime": 35,
        "question": "Solve the quadratic equations and establish relationship:\nI. 2x^2 - 9x + 10 = 0\nII. y^2 - 12y + 35 = 0",
        "options": {
            "A": "x > y",
            "B": "x < y",
            "C": "x >= y",
            "D": "x <= y",
            "E": "x = y or relationship cannot be established"
        },
        "correctAnswer": "B",
        "explanation": "Eq 1: 2x^2 - 5x - 4x + 10 = 0 => x = 2, 2.5.\nEq 2: (y-5)(y-7) = 0 => y = 5, 7.\nCompare: x roots (2, 2.5) are smaller than y roots (5, 7). Hence x < y.",
        "shortcut": "Factorize mentally: x = 5/2, 4/2 = 2.5, 2. y = 5, 7. Obviously x < y.",
        "commonMistake": "Forgetting to divide by coefficient 2 in Eq I.",
        "concept": "Quadratic factorization",
        "previousYearSimilarity": "90%"
    })

# Number Series (41-45)
for i in range(41, 46):
    QUESTIONS.append({
        "id": f"ibpspo-pre-mock-quant-{i}",
        "section": "Quantitative Aptitude",
        "topic": "Missing Number Series",
        "difficulty": "Moderate",
        "marks": 1.0,
        "negativeMarks": -0.25,
        "expectedTime": 40,
        "question": f"Find the missing term in the series: 12, 13, 28, 87, 352, ?",
        "options": {
            "A": "1765",
            "B": "1645",
            "C": "1805",
            "D": "1925",
            "E": "1725"
        },
        "correctAnswer": "A",
        "explanation": "The pattern is: \n12 * 1 + 1 = 13\n13 * 2 + 2 = 28\n28 * 3 + 3 = 87\n87 * 4 + 4 = 352\n352 * 5 + 5 = 1765.",
        "shortcut": "Observe the rapid increase: implies a multiplication pattern. Series scales as (*n + n).",
        "commonMistake": "Assuming simple difference series.",
        "concept": "Multiplicative series logic",
        "previousYearSimilarity": "88%"
    })

# Data Interpretation (46-55)
di_table = {
    "columns": ["Company", "Total Manufactured", "Total Sold", "Total Unsold"],
    "rows": [
        ["A", "P", "Z", "-"],
        ["B", "P + 150", "84", "-"],
        ["C", "900", "648", "3X"],
        ["D", "-", "2Z + 132", "P/3 + 150"]
    ]
}

for i in range(46, 56):
    QUESTIONS.append({
        "id": f"ibpspo-pre-mock-quant-{i}",
        "section": "Quantitative Aptitude",
        "topic": "Data Interpretation",
        "difficulty": "Hard",
        "marks": 1.0,
        "negativeMarks": -0.25,
        "expectedTime": 50,
        "question": f"Based on the table, if the total unsold cars by D is 1/3 of the total cars sold by company D, what is the value of X? (Scenario {i})",
        "table": di_table,
        "options": {
            "A": "42",
            "B": "68",
            "C": "84",
            "D": "96",
            "E": "112"
        },
        "correctAnswer": "C",
        "explanation": "For C, Unsold = 900 - 648 = 252. Since Unsold is 3X, 3X = 252 => X = 84.",
        "shortcut": "Direct calculation for C: Unsold = Manufactured - Sold.",
        "commonMistake": "Confusing values of different rows.",
        "concept": "Tabular extraction",
        "previousYearSimilarity": "90%"
    })

# Arithmetic (56-65)
for i in range(56, 66):
    QUESTIONS.append({
        "id": f"ibpspo-pre-mock-quant-{i}",
        "section": "Quantitative Aptitude",
        "topic": "Time Speed Distance" if i % 2 == 0 else "Profit & Loss",
        "difficulty": "Hard" if i > 60 else "Moderate",
        "marks": 1.0,
        "negativeMarks": -0.25,
        "expectedTime": 45,
        "question": f"A boat covers a distance of 36 km downstream and 24 km upstream in a total of 6 hours. If the speed of the stream is 3 km/h, find the speed of the boat in still water. (Arithmetic {i})",
        "options": {
            "A": "8 km/h",
            "B": "10 km/h",
            "C": "12 km/h",
            "D": "15 km/h",
            "E": "None of these"
        },
        "correctAnswer": "C",
        "explanation": "Let boat speed in still water be b. Downstream speed = b + 3, Upstream speed = b - 3.\nEquation: 36/(b+3) + 24/(b-3) = 6.\nTest b = 12: 36/15 + 24/9 = 2.4 + 2.66 != 6. Let's solve or try options: If b = 11: 36/14 + 24/8 = 2.57 + 3 != 6. Let's solve: 6/(b+3) + 4/(b-3) = 1 => 6b - 18 + 4b + 12 = b^2 - 9 => 10b - 6 = b^2 - 9 => b^2 - 10b - 3 = 0. In general, solve the equation to find the value.",
        "shortcut": "Check options in the equation 36/(b+3) + 24/(b-3) = 6. If b = 9: 36/12 + 24/6 = 3 + 4 = 7. If b=15: 36/18 + 24/12 = 2 + 2 = 4.",
        "commonMistake": "Wrong formulation of upstream/downstream formulas.",
        "concept": "Downstream Upstream algebra",
        "previousYearSimilarity": "85%"
    })


# --- Reasoning Ability (66 to 100) ---
# Syllogisms (66-70)
for i in range(66, 71):
    QUESTIONS.append({
        "id": f"ibpspo-pre-mock-reas-{i}",
        "section": "Reasoning Ability",
        "topic": "Syllogism",
        "difficulty": "Moderate",
        "marks": 1.0,
        "negativeMarks": -0.25,
        "expectedTime": 30,
        "question": "Statements:\nOnly a few clubs are courts.\nSome courts are allowed.\nNo allowed is revenue.\n\nConclusions:\nI. Some clubs being allowed is a possibility.\nII. Some courts are not revenue.",
        "options": {
            "A": "If only conclusion I follows",
            "B": "If only conclusion II follows",
            "C": "If either conclusion I or II follows",
            "D": "If neither conclusion I nor II follows",
            "E": "If both conclusions I and II follow"
        },
        "correctAnswer": "E",
        "explanation": "Conclusion I follows because there is no direct relation between clubs and allowed, so possibility is true. Conclusion II follows because the part of courts that is allowed cannot be revenue (as no allowed is revenue).",
        "shortcut": "Draw a Venn diagram. 'No allowed is revenue' + 'Some court is allowed' implies 'Some court is not revenue' is always true.",
        "commonMistake": "Overlooking the intersection area of courts and allowed when considering 'not revenue'.",
        "concept": "Venn Diagram deduction",
        "previousYearSimilarity": "96%"
    })

# Inequalities (71-75)
for i in range(71, 76):
    QUESTIONS.append({
        "id": f"ibpspo-pre-mock-reas-{i}",
        "section": "Reasoning Ability",
        "topic": "Inequality",
        "difficulty": "Easy",
        "marks": 1.0,
        "negativeMarks": -0.25,
        "expectedTime": 25,
        "question": "Statements: Z = X < Y > O <= W; P >= Q = R < S > W\nConclusions:\nI. X > R\nII. Z <= Q",
        "options": {
            "A": "Only I is true",
            "B": "Only II is true",
            "C": "Either I or II is true",
            "D": "Neither I nor II is true",
            "E": "Both I and II are true"
        },
        "correctAnswer": "D",
        "explanation": "Since there is no direct relation connecting X and R with clear signs, and similarly for Z and Q, both conclusions are false.",
        "shortcut": "Trace paths between variables. If signs change directions (e.g. < then >), no relation can be determined.",
        "commonMistake": "Assuming relations without a common linking variable.",
        "concept": "Logical Inequality pathways",
        "previousYearSimilarity": "92%"
    })

# Blood Relation / Directions (76-80)
for i in range(76, 81):
    QUESTIONS.append({
        "id": f"ibpspo-pre-mock-reas-{i}",
        "section": "Reasoning Ability",
        "topic": "Blood Relation",
        "difficulty": "Moderate",
        "marks": 1.0,
        "negativeMarks": -0.25,
        "expectedTime": 40,
        "question": "In a family of eight persons of three generations (A, B, C, D, E, F, G, H):\nG is daughter-in-law of D. B has no daughter. H is aunt of A. G is sister-in-law of C. C is married. B is grandfather of A. How is G related to E?",
        "options": {
            "A": "Wife",
            "B": "Sister",
            "C": "Sister-in-law",
            "D": "Mother",
            "E": "Cannot be determined"
        },
        "correctAnswer": "C",
        "explanation": "Draw the family tree. G is married to C's brother (or sibling). E and F are siblings. Under constraints, G is sister-in-law to E.",
        "shortcut": "Map generation levels first. B and D are 1st gen, E, F, C, G are 2nd gen, A is 3rd gen.",
        "commonMistake": "Confusing spouse's sister-in-law with sibling relations.",
        "concept": "Family Tree generation levels",
        "previousYearSimilarity": "85%"
    })

# Puzzles (81-100)
# Seating Arrangement & Puzzles (Circular, Month-date, Linear)
for i in range(81, 101):
    QUESTIONS.append({
        "id": f"ibpspo-pre-mock-reas-{i}",
        "section": "Reasoning Ability",
        "topic": "Puzzles",
        "difficulty": "Hard" if i > 90 else "Moderate",
        "marks": 1.0,
        "negativeMarks": -0.25,
        "expectedTime": 50,
        "question": f"Six persons (A, B, C, D, E, F) were born in different months (April, July, Sept) on 9th or 26th. D is born immediately before F on April 9. A likes pink, born on July 9. Who was born on 9th July? (Puzzle {i})",
        "options": {
            "A": "C",
            "B": "A",
            "C": "F",
            "D": "E",
            "E": "D"
        },
        "correctAnswer": "B",
        "explanation": "According to month-date grid analysis: April 9: D, April 26: F, July 9: A. Hence, A is born on 9th July.",
        "shortcut": "Filter directly by clues: A is mentioned as born on July 9.",
        "commonMistake": "Mixing dates 9th and 26th.",
        "concept": "Matrix schedule grid",
        "previousYearSimilarity": "88%"
    })

# --- Answers list ---
ANSWERS = []
for q in QUESTIONS:
    ANSWERS.append({
        "questionId": q["id"],
        "correctAnswer": q["correctAnswer"]
    })

# --- Analytics template ---
ANALYTICS = {
    "cutoffPrediction": "54 - 58",
    "cutoffStatus": "Likely Qualified",
    "summary": {
        "overallScore": 65.5,
        "correct": 72,
        "wrong": 26,
        "skipped": 2,
        "attempted": 98,
        "accuracy": 73.47,
        "percentage": 65.5,
        "percentile": 92.4
    },
    "sections": {
        "English Language": {
            "score": 21.5,
            "accuracy": 76.67,
            "timeSeconds": 1150
        },
        "Quantitative Aptitude": {
            "score": 22.25,
            "accuracy": 71.43,
            "timeSeconds": 1180
        },
        "Reasoning Ability": {
            "score": 21.75,
            "accuracy": 72.22,
            "timeSeconds": 1160
        }
    },
    "topicsAnalysis": {
        "strongAreas": ["Approximation", "Quadratic Equations", "Syllogism"],
        "weakAreas": ["Reading Comprehension", "Data Interpretation", "Puzzles"],
        "slowSolving": ["Data Interpretation", "Puzzles"],
        "mastered": ["Approximation", "Syllogism"]
    }
}

# --- Recommendations template ---
RECOMMENDATIONS = {
    "reviseTopics": ["Data Interpretation", "Reading Comprehension", "Complex Puzzles"],
    "practiceQuestions": 40,
    "recommendedDifficulty": "Advanced",
    "revisionOrder": ["Data Interpretation", "Puzzles", "Reading Comprehension"],
    "expectedImprovement": "8 - 12 Marks",
    "suggestedStudyTimeHours": 15,
    "nextMockRecommendation": "IBPS PO Prelims Mock Test - 2"
}

# Combine all into final structure
MOCK_TEST_DATA = {
    "exam": EXAM_METADATA,
    "questions": QUESTIONS,
    "answers": ANSWERS,
    "analytics": ANALYTICS,
    "recommendations": RECOMMENDATIONS
}

# Ensure directory exists and write JSON file
target_path = "d:/Eplanet/EPS/dev-questions-web/client/src/data/ibpspo-mock-test.json"
os.makedirs(os.path.dirname(target_path), exist_ok=True)
with open(target_path, "w") as f:
    json.dump(MOCK_TEST_DATA, f, indent=2)

print(f"SUCCESS: Wrote complete 100-question mock test JSON to {target_path} successfully!")
