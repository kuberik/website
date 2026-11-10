#!/usr/bin/env bash
# Subsets the two fonts the first frame needs to the glyphs the film prints (Basic Latin, middle dot, dashes, quotes, arrows, tick, multiply, minus).
# Inter keeps its wght/opsz axes. Needs fonttools (pyftsubset: PYFTSUBSET=/path or on PATH); without it the dashboard's full fonts are copied (about 40 KB gz heavier).
set -euo pipefail
SRC="$1"; OUT="$2"; mkdir -p "$OUT"
PY="${PYFTSUBSET:-$(command -v pyftsubset || true)}"
U="U+0020-007E,U+00A0,U+00B7,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2022,U+2026,U+2190-2193,U+2212,U+2713,U+2715,U+00D7"
for f in inter-latin-opsz:'kern,liga,calt,tnum,case,ss01,cv11,zero,ccmp,locl,mark,mkmk' jetbrains-mono-latin:'kern,tnum,zero,ccmp,mark,mkmk'; do
	n="${f%%:*}"; feat="${f#*:}"
	if [ -n "$PY" ]; then "$PY" "$SRC/$n.woff2" --unicodes="$U" --flavor=woff2 --layout-features="$feat" --output-file="$OUT/$n.woff2"; else cp "$SRC/$n.woff2" "$OUT/$n.woff2"; echo "no pyftsubset: copied full $n"; fi
done
