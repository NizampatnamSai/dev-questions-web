"""Chart data recovered by hand for DI sets whose graphs are IMAGES in the source PDFs.

Roughly 6% of the imported questions belong to a Data Interpretation set whose
pie/bar/line chart never made it into the text layer, leaving the questions
unanswerable. The numbers are almost always recoverable from the worked
solutions, because the solution restates the values it is using — e.g. 2020's
S31 reads "(64 - 30) + (72 - 32) + (76 - 48)", which hands back three of the
line graph's points directly.

Each entry is keyed by (paper_id, first_question_number) and carries the table
that build_pyq.py injects into every question of that set, replacing the
"chart not included" warning.

`checks` records arithmetic from the published solutions that the recovered
numbers must reproduce; verify_charts.py asserts them, so a mis-transcribed
value fails loudly instead of silently teaching the wrong figure.
"""

CHARTS = {
    # ── 2023, Q46-51 ──────────────────────────────────────────────────────────
    # Two pie charts. Recovered from "Sol. (46-51)" which works every club out
    # longhand: 2500 x 24/100 = 600, 1200 x 20/100 = 240, and so on.
    ("ibpspo-2023-prelims", 46): {
        "span": 6,
        "note": "Pie (i) total people (male + female) = 2500.  Pie (ii) total males = 1200.",
        "columns": ["Club", "% of total people", "% of total males", "People", "Males", "Females"],
        "rows": [
            ["A", "24%", "20%", "600", "240", "360"],
            ["B", "16%", "15%", "400", "180", "220"],
            ["C", "18%", "35%", "450", "420", "30"],
            ["D", "30%", "12%", "750", "144", "606"],
            ["E", "12%", "18%", "300", "216", "84"],
        ],
        "checks": [
            ("sum of people % = 100", lambda: 24 + 16 + 18 + 30 + 12 == 100),
            ("sum of male % = 100", lambda: 20 + 15 + 35 + 12 + 18 == 100),
            ("people total = 2500", lambda: 600 + 400 + 450 + 750 + 300 == 2500),
            ("males total = 1200", lambda: 240 + 180 + 420 + 144 + 216 == 1200),
            ("females = people - males", lambda: all(
                p - m == f for p, m, f in
                [(600, 240, 360), (400, 180, 220), (450, 420, 30), (750, 144, 606), (300, 216, 84)])),
            # S46: females B+C as % of people in D  = 250/750 = 33.33%
            ("S46 = 33.33%", lambda: round((220 + 30) / 750 * 100, 2) == 33.33),
            # S49: revenue 240x150 + 180x200 + 216x250 = 126000
            ("S49 = 126000", lambda: 240 * 150 + 180 * 200 + 216 * 250 == 126000),
            # S48: 126x3 - (220+84) = 74 females in X; males X = 45% of 240 = 108
            ("S48 = 208", lambda: (360 + 30) - (108 + 74) == 208),
        ],
    },

    # ── 2021, Q56-60 ──────────────────────────────────────────────────────────
    # Pie percentages survived in the directions text; the science column came
    # from the solutions, which each compute "total - science = commerce"
    # (S57 gives Western 750, S58 gives Central 600).
    ("ibpspo-2021-prelims", 56): {
        "span": 5,
        "note": "Pie: % distribution of total students (Science + Commerce) = 4000.  Table: students in Science.",
        "columns": ["Zone", "% of total", "Total students", "Science", "Commerce"],
        "rows": [
            ["Northern", "25%", "1000", "400", "600"],
            ["Western", "30%", "1200", "750", "450"],
            ["Eastern", "10%", "400", "310", "90"],
            ["Central", "20%", "800", "600", "200"],
            ["Southern", "15%", "600", "430", "170"],
        ],
        "checks": [
            ("percentages sum to 100", lambda: 25 + 30 + 10 + 20 + 15 == 100),
            ("totals sum to 4000", lambda: 1000 + 1200 + 400 + 800 + 600 == 4000),
            ("science + commerce = total", lambda: all(
                s + c == t for t, s, c in
                [(1000, 400, 600), (1200, 750, 450), (400, 310, 90), (800, 600, 200), (600, 430, 170)])),
            # S56: Northern commerce 600 vs Southern total 600 -> 0%
            ("S56 = 0%", lambda: (600 - 600) / 600 * 100 == 0),
            # S57: science N+E+S = 1140, minus Western commerce 450 -> 690
            ("S57 = 690", lambda: (400 + 310 + 430) - 450 == 690),
            # S58: 600 science x 80 + 200 commerce x 60 = 60000
            ("S58 = 60000", lambda: 600 * 80 + 200 * 60 == 60000),
            # S59: Western arts = 1200 x 7/5 = 1680; Southern commerce 170
            ("S59 = 1510", lambda: 1200 * 7 // 5 - 170 == 1510),
            # S60: Western science 750 : Eastern commerce 90 = 25 : 3
            ("S60 = 25:3", lambda: 750 * 3 == 90 * 25),
        ],
    },

    # ── 2022, Q56-60 ──────────────────────────────────────────────────────────
    # Bar graph, tax in thousands. S59 gives 2018 (24, 50, 36), S58 gives Apurv
    # 2019 = 60, and S57's denominator (40+36) pins Mayank 2019 = 40, leaving
    # Tarun 2019 = 30 from S58's (30 + 40).
    ("ibpspo-2022-prelims", 56): {
        "span": 5,
        "note": "Bar graph: tax paid (in '000) by three people across two years.",
        "columns": ["Person", "2018 (₹'000)", "2019 (₹'000)", "Both years"],
        "rows": [
            ["Tarun", "24", "30", "54"],
            ["Apurv", "50", "60", "110"],
            ["Mayank", "36", "40", "76"],
        ],
        "checks": [
            ("row totals", lambda: all(a + b == t for a, b, t in [(24, 30, 54), (50, 60, 110), (36, 40, 76)])),
            # S56: Apurv 2019 income tax = 60000 x 7/10 = 42000, + Tarun 2018 24000
            ("S56 = 66000", lambda: 60000 * 7 // 10 + 24000 == 66000),
            # S57: |76 - 54| / 76 x 100 = 28.94%
            ("S57 ~ 29%", lambda: round((76 - 54) / 76 * 100, 2) == 28.95 or round((76 - 54) / 76 * 100) == 29),
            # S58: (50 + 60) - (30 + 40) = 40 -> 40000
            ("S58 = 40000", lambda: ((50 + 60) - (30 + 40)) * 1000 == 40000),
            # S59: (24 + 36) : 50 = 6 : 5
            ("S59 = 6:5", lambda: (24 + 36) * 5 == 50 * 6),
            # S60: Mayank 2018 tax 36000 = 1/4 of income -> 144000
            ("S60 income = 144000", lambda: 36000 * 4 == 144000),
        ],
    },

    # ── 2020, Q31-35 ──────────────────────────────────────────────────────────
    # Line graph, read directly off the rendered PDF page (page 8 of
    # prelims-2020.pdf) rather than inferred — the solutions only pinned A, B
    # and C. S31's "(64-30)+(72-32)+(76-48) = 102" confirms the reading.
    ("ibpspo-2020-prelims", 31): {
        "span": 5,
        "note": "Line graph: people (Boys + Girls) visiting five parks, and the girls among them.",
        "columns": ["Park", "Boys + Girls", "Girls", "Boys"],
        "rows": [
            ["A", "64", "30", "34"],
            ["B", "72", "32", "40"],
            ["C", "76", "48", "28"],
            ["D", "68", "44", "24"],
            ["E", "54", "36", "18"],
        ],
        "checks": [
            ("boys = total - girls", lambda: all(
                t - g == b for t, g, b in
                [(64, 30, 34), (72, 32, 40), (76, 48, 28), (68, 44, 24), (54, 36, 18)])),
            # S31: boys in A + B + C = 102
            ("S31 = 102", lambda: 34 + 40 + 28 == 102),
            # S35: park B total vs park E total -> 33% more
            ("S35 ~ 33%", lambda: round((72 - 54) / 54 * 100) == 33),
            # girls never exceed the total
            ("girls <= total", lambda: all(g <= t for t, g in
                                           [(64, 30), (72, 32), (76, 48), (68, 44), (54, 36)])),
        ],
    },
}
