#!/usr/bin/env bash
# The hero film's release checks, one browser at a time: check.mjs (no blank window, no flat frame, spinners painted, the story advances and wraps; reduced
# motion rests) at 1440 and 390, both themes, unthrottled and Fast 3G; then gate.mjs (controls, isolation, every beat) at 1440 and 390.
#   URL   the served page (default http://127.0.0.1:1313/)
#   OUT   where the results go (default $TMPDIR/film-checks)
#   LOCK  optional flock file shared with other browser jobs on the host
# Exit 1 if anything fails. Run from anywhere after islands/build.sh (it links node_modules, which provides @playwright/test).
cd "$(dirname "$0")"; OUT=${OUT:-${TMPDIR:-/tmp}/film-checks}; mkdir -p "$OUT"; rc=0
L() { if [ -n "${LOCK:-}" ]; then flock "$LOCK" "$@"; else "$@"; fi; }
run() { L node check.mjs "$@" >| "$OUT/check-$1-$3-$5.json" 2>&1; echo "exit=$?" >> "$OUT/check-$1-$3-$5.json"; }
for c in "1440 900" "390 844"; do set -- $c; run $1 $2 reduced 1 none; done
for thr in none fast3g; do for c in "1440 900 light" "1440 900 dark" "390 844 light" "390 844 dark"; do set -- $c; run $1 $2 $3 2 $thr; done; done
for f in "$OUT"/check-*.json; do grep -q '^exit=0' "$f" || { echo "FAILED: $f"; rc=1; }; done
for c in "1440 900" "390 844"; do set -- $c
  L node gate.mjs $1 $2 >| "$OUT/gate-$1.out" 2>&1 || rc=1
  echo "gate $1: ok=$(grep -c '^ok' "$OUT/gate-$1.out") fail=$(grep -c '^FAIL' "$OUT/gate-$1.out")"; grep -E '^FAIL' "$OUT/gate-$1.out"
done
echo "check-all rc=$rc ($OUT)"; exit $rc
