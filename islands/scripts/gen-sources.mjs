// Writes sources.auto.txt: every dashboard module (src/, relative to the dashboard's src/) that the last build bundled. Tailwind scans only these.
// Returns exit code 3 when the list changed (build.sh then rebuilds once so the stylesheet matches the graph).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
const mods = readFileSync(new URL('../.gen/modules.txt', import.meta.url), 'utf8').split('\n');
const set = new Set();
for (const l of mods) { const m = l.match(/\$DASH\/src\/(\S+\.(?:svelte|ts|js))(?:\?.*)?$/); if (m) set.add(m[1]); }
const out = [...set].sort().join('\n') + '\n';
const f = new URL('../sources.auto.txt', import.meta.url);
const prev = existsSync(f) ? readFileSync(f, 'utf8') : '';
if (prev !== out) { writeFileSync(f, out); console.log(`sources.auto.txt: ${set.size} modules (changed)`); process.exit(3); }
console.log(`sources.auto.txt: ${set.size} modules (unchanged)`);
