#!/usr/bin/env bash
# Subsets the fonts the first frame needs to the glyphs the film prints.
#  - inter-latin-opsz / jetbrains-mono-latin: Basic Latin, middle dot, dashes, quotes, bullets, ellipsis, arrows up/down, minus, multiply, single right quote (from the dashboard's own latin subsets).
#  - inter-symbols: the symbols the dashboard's latin subset LACKS (left/right arrows, up-right arrow, return arrow, check mark, command key), cut from the FULL Inter (set INTER_FULL=.../InterVariable.woff2; npm pack inter-ui gives it).
# Inter keeps its wght/opsz axes. Needs fonttools (pyftsubset: PYFTSUBSET=/path or on PATH). FAILS LOUDLY when a tool or ANY requested codepoint is missing from its output (pyftsubset drops missing glyphs silently).
set -euo pipefail
SRC="$1"; OUT="$2"; mkdir -p "$OUT"
PY="${PYFTSUBSET:-$(command -v pyftsubset || true)}"
[ -n "$PY" ] && [ -x "$PY" ] || { echo "subset-fonts.sh: pyftsubset not found (set PYFTSUBSET, e.g. /home/luka/projects/kuberik/.work/landing-v5/.venv-fonts/bin/pyftsubset)" >&2; exit 1; }
PYBIN="$(dirname "$PY")/python"
FULL="${INTER_FULL:-/home/luka/projects/kuberik/.work/landing-v5/fonts-full/x1/package/variable/InterVariable.woff2}"
[ -f "$FULL" ] || { echo "subset-fonts.sh: full Inter not found at $FULL (set INTER_FULL; npm pack inter-ui -> package/variable/InterVariable.woff2)" >&2; exit 1; }
U="U+0020-007E,U+00A0,U+00B7,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2022,U+2026,U+2191,U+2193,U+2212,U+00D7,U+203A"
S="U+2190,U+2192,U+2197,U+21B5,U+2713,U+2318"
cut() { # <font> <unicodes> <features> <out>
	"$PY" "$1" --unicodes="$2" --flavor=woff2 --layout-features="$3" --output-file="$4"
	"$PYBIN" - "$4" "$2" <<'PY' 2>/dev/null
import sys, re
from fontTools.ttLib import TTFont
cm = TTFont(sys.argv[1]).getBestCmap(); miss = []
for part in sys.argv[2].replace("U+", "").split(","):
    a, _, b = part.partition("-")
    for cp in range(int(a, 16), int(b or a, 16) + 1):
        if cp not in cm: miss.append(hex(cp))
if miss: sys.exit(f"subset-fonts.sh: {sys.argv[1]} lacks requested codepoints {miss}")
PY
}
cut "$SRC/inter-latin-opsz.woff2" "$U" 'kern,liga,calt,tnum,case,ss01,cv11,zero,ccmp,locl,mark,mkmk' "$OUT/inter-latin-opsz.woff2"
cut "$SRC/jetbrains-mono-latin.woff2" "$U" 'kern,tnum,zero,ccmp,mark,mkmk' "$OUT/jetbrains-mono-latin.woff2"
cut "$FULL" "$S" 'kern,ccmp' "$OUT/inter-symbols.woff2"
