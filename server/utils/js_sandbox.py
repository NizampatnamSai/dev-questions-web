"""Runs untrusted JS against test cases inside an isolated V8 context (py_mini_racer).

Security: a fresh MiniRacer() context has no Node/host bindings injected (no require,
no process, no filesystem/network) — it's a bare V8 isolate. Nothing is shared between
test cases or submissions; every call gets a brand-new context.

Must use eval_cancelable() + asyncio.wait_for() rather than eval(timeout=...) — the
sync timeout path raises when called from inside a running event loop (every FastAPI
route handler has one), and eval_cancelable is the only variant that actually
terminates V8 execution on timeout rather than just abandoning the awaiting coroutine
(confirmed: repeated timeouts don't accumulate CPU/thread cost — see plan verification).
"""
import asyncio
import json
from py_mini_racer import MiniRacer

DEFAULT_TIMEOUT_S = 2.0


async def _run_one(user_code: str, args: list, timeout_s: float) -> dict:
    harness = f"""
{user_code}
;(function() {{
  try {{
    var __args = {json.dumps(args)};
    var __result = solve.apply(null, __args);
    return JSON.stringify({{ ok: true, value: __result === undefined ? null : __result }});
  }} catch (e) {{
    return JSON.stringify({{ ok: false, error: String((e && e.message) || e) }});
  }}
}})();
"""
    ctx = MiniRacer()
    try:
        raw = await asyncio.wait_for(ctx.eval_cancelable(harness), timeout=timeout_s)
        return json.loads(raw)
    except asyncio.TimeoutError:
        return {"ok": False, "error": f"Execution timed out after {timeout_s}s"}
    except Exception as e:
        return {"ok": False, "error": str(e)}


async def run_test_cases(user_code: str, test_cases: list, timeout_s: float = DEFAULT_TIMEOUT_S) -> list:
    """user_code must define `function solve(...)`. Each test case is {input: [...args], expected: value}.
    Returns [{input, expected, actual, passed, error}] — one entry per test case, in order."""
    results = []
    for tc in test_cases:
        args = tc.get("input", [])
        expected = tc.get("expected")
        outcome = await _run_one(user_code, args, timeout_s)
        if outcome.get("ok"):
            actual = outcome.get("value")
            results.append({
                "input": args, "expected": expected, "actual": actual,
                "passed": actual == expected, "error": None,
            })
        else:
            results.append({
                "input": args, "expected": expected, "actual": None,
                "passed": False, "error": outcome.get("error", "Unknown error"),
            })
    return results


def all_passed(results: list) -> bool:
    return bool(results) and all(r["passed"] for r in results)
