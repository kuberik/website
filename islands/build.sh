#!/usr/bin/env bash
# Rebuild static/islands/ from the dashboard checkout.
#   DASHBOARD_SRC  the dashboard's frontend/ dir (required; the landing is pinned to the commit recorded in static/islands/BUILT-FROM)
# The dashboard is only READ. Its node_modules is borrowed (symlinked here) so we compile with the dashboard's own
# svelte/vite/tailwind versions; if the checkout has none, point at any frontend/node_modules with the same lockfile
# via DASHBOARD_NODE_MODULES.
set -euo pipefail
cd "$(dirname "$0")"
export DASHBOARD_SRC="${DASHBOARD_SRC:?set DASHBOARD_SRC to the frontend dir of a dashboard checkout}"
NM="${DASHBOARD_NODE_MODULES:-$DASHBOARD_SRC/node_modules}"
[ -d "$NM" ] || { echo "no node_modules at $NM (set DASHBOARD_NODE_MODULES)"; exit 1; }
ln -sfn "$NM" node_modules
ln -sfn "$DASHBOARD_SRC" dashboard
# Two passes at most: the stylesheet scans exactly the dashboard modules the previous build bundled (sources.auto.txt); if the graph moved, rebuild once.
node scripts/gen-css.mjs
node_modules/.bin/vite build --config vite.config.ts
if ! node scripts/gen-sources.mjs; then node scripts/gen-css.mjs; node_modules/.bin/vite build --config vite.config.ts; node scripts/gen-sources.mjs || { echo "module graph unstable"; exit 1; }; fi
mkdir -p ../static/islands/fonts && cp "$DASHBOARD_SRC"/static/fonts/*.woff2 ../static/islands/fonts/
bash scripts/subset-fonts.sh "$DASHBOARD_SRC/static/fonts" ../static/islands/fonts
echo "dashboard $(git -C "$DASHBOARD_SRC" rev-parse --short HEAD 2>/dev/null || echo '?')" > ../static/islands/BUILT-FROM
ls -l ../static/islands
