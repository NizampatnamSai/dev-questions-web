"""Assert every recovered chart reproduces the arithmetic in its published solutions.

Hand-recovered numbers are only trustworthy if they regenerate the answers the
source printed. Each entry in chart_data.CHARTS carries `checks` taken from the
worked solutions; this runs them all and fails loudly on any mismatch, so a
mistyped figure can never ship as a confidently-wrong study aid.
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from chart_data import CHARTS


def main():
    total = failed = 0
    for (pid, q0), entry in sorted(CHARTS.items()):
        print(f"\n{pid}  Q{q0}-  ({len(entry['rows'])} rows)")
        for label, fn in entry.get("checks", []):
            total += 1
            try:
                ok = bool(fn())
            except Exception as exc:                       # noqa: BLE001
                ok, label = False, f"{label}  [raised {exc!r}]"
            print(f"   {'PASS' if ok else 'FAIL'}  {label}")
            if not ok:
                failed += 1
    print(f"\n{total - failed}/{total} checks passed across {len(CHARTS)} recovered sets")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
