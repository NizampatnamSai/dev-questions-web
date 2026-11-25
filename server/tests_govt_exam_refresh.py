"""Tests for the online-check trust rules (utils/govt_exam_refresh.evaluate).

Run:  venv/bin/python tests_govt_exam_refresh.py
No network or database needed — evaluate() is pure.
"""
from datetime import date

from utils.govt_exam_refresh import evaluate, number_in_text, is_official

TODAY = date(2026, 11, 25)
EXAM = {"id": "ibps-po", "name": "IBPS PO", "officialSite": {"url": "https://www.ibps.in/"}}
OFFICIAL = "https://www.ibps.in/notice.pdf"
NEWS1, NEWS2 = "https://www.adda247.com/x", "https://www.careers360.com/y"

expected_2027 = {"id": "2027", "year": 2027, "label": "CRP PO/MT-XVII (expected)", "status": "EXPECTED_2027",
                 "vacancies": {"value": None, "provenance": "NOT_ANNOUNCED"}, "application": {"provenance": "NOT_ANNOUNCED"}}
notified_2026 = {"id": "2026", "year": 2026, "label": "CRP PO/MT-XVI", "status": "RESULT_AWAITED",
                 "vacancies": {"value": 7365, "provenance": "OFFICIAL"},
                 "application": {"start": "2026-07-01", "end": "2026-07-26", "provenance": "OFFICIAL"}}

results = []


def check(name, cond):
    results.append((name, bool(cond)))


# 1. The real failure seen in testing: model reports the ORIGINAL 6,715 where we hold the revised 7,365.
p, ch = evaluate(EXAM, notified_2026, {"status": "RESULT_AWAITED", "vacancies_total": 6715, "evidence": "6,715 vacancies", "sources": [OFFICIAL]}, TODAY)
check("held figure is never overwritten", "vacancies" not in p)
check("…but the difference is logged for review", any(c["field"] == "vacancies" and not c["applied"] for c in ch))

# 2. Status never moves backwards.
p, _ = evaluate(EXAM, notified_2026, {"status": "EXAM_SCHEDULED", "sources": [OFFICIAL]}, TODAY)
check("no backwards status move", "status" not in p)

# 3. Expected cycle becomes notified only with a trusted source.
found = {"status": "NOTIFICATION_RELEASED", "vacancies_total": 8000, "evidence": "IBPS notifies 8,000 PO posts",
         "application_start": "2027-07-01", "application_end": "2027-07-21"}
p, _ = evaluate(EXAM, expected_2027, {**found, "sources": [NEWS1]}, TODAY)
check("one third-party source is not enough to mark notified", "status" not in p and "vacancies" not in p)
p, _ = evaluate(EXAM, expected_2027, {**found, "sources": [NEWS1, NEWS2]}, TODAY)
check("two independent sources mark it notified", p.get("status") == "NOTIFICATION_RELEASED")
check("…and fill the missing vacancy figure", p.get("vacancies", {}).get("value") == 8000)
check("…flagged unverified (no official source)", p.get("statusVerified") is False)
p, _ = evaluate(EXAM, expected_2027, {**found, "sources": [OFFICIAL]}, TODAY)
check("official source marks it notified and verified", p.get("status") == "NOTIFICATION_RELEASED" and p.get("statusVerified") is True)

# 4. Vacancy must appear in the evidence.
p, ch = evaluate(EXAM, expected_2027, {**found, "evidence": "IBPS PO notification out", "sources": [OFFICIAL]}, TODAY)
check("vacancy not in evidence is not applied", "vacancies" not in p)

# 5. Open/closed derived from dates, not trusted from the model.
p, _ = evaluate(EXAM, expected_2027, {**found, "status": "APPLICATION_OPEN", "sources": [OFFICIAL]}, TODAY)
check("model says OPEN but window is in 2027 → Notification Released", p.get("status") == "NOTIFICATION_RELEASED")
p, _ = evaluate(EXAM, expected_2027, {**found, "application_start": "2026-11-20", "application_end": "2026-12-10", "sources": [OFFICIAL]}, TODAY)
check("window spanning today → Application Open", p.get("status") == "APPLICATION_OPEN")

# 6. Links: official domain only.
p, _ = evaluate(EXAM, expected_2027, {**found, "notification_url": "https://coaching.example.com/ibps.pdf", "sources": [OFFICIAL]}, TODAY)
check("third-party notification link ignored", "notificationLink" not in p)
p, _ = evaluate(EXAM, expected_2027, {**found, "notification_url": OFFICIAL, "sources": [OFFICIAL]}, TODAY)
check("official notification link accepted", p.get("notificationLink", {}).get("url") == OFFICIAL)

# 7. Dates outside the cycle's years are rejected.
p, _ = evaluate(EXAM, expected_2027, {**found, "application_start": "2019-07-01", "sources": [OFFICIAL]}, TODAY)
check("implausible year rejected", p.get("application", {}).get("start") != "2019-07-01")

# 8. Helpers.
check("number_in_text: grouped", number_in_text(7365, "a total of 7,365 posts"))
check("number_in_text: Indian grouping", number_in_text(150374, "gross ₹1,50,374 per month"))
check("number_in_text: no partial match", not number_in_text(1500, "15000 posts in 2026"))
check("is_official: subdomain", is_official("https://ibpsreg.ibps.in/x", EXAM))
check("is_official: lookalike rejected", not is_official("https://ibps.in.fake.com/x", EXAM))

failed = [n for n, ok in results if not ok]
for n, ok in results:
    print(("✓ " if ok else "✗ ") + n)
print(f"\n{len(results) - len(failed)}/{len(results)} passed")
raise SystemExit(1 if failed else 0)
