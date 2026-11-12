// node jtable.mjs <jitter outdir> : recompute the per-transition table from raf.json + frames.json (same rules as jitter.mjs)
import fs from 'fs';
const d = process.argv[2]; const { F, LOAF, evAt } = JSON.parse(fs.readFileSync(d + '/raf.json')); const keep = JSON.parse(fs.readFileSync(d + '/frames.json'));
const ty = (m) => +(m.match(/matrix\([^)]*,\s*([-\d.]+)\)$/)?.[1] ?? 0), tx = (m) => +(m.match(/matrix\([^,]*,[^,]*,[^,]*,[^,]*,\s*([-\d.]+),/)?.[1] ?? 0);
const rows = [];
for (const [k, a] of Object.entries(evAt)) {
  const win = F.filter((f) => f.at >= a - 300 && f.at <= a + 800), dts = win.slice(1).map((f, j) => f.at - win[j].at);
  let snaps = 0, reflows = 0;
  for (let j = 1; j < win.length; j++) { const A = win[j - 1], B = win[j]; const covered = B.sn > 0 && B.sop.split(',').some((o) => +o > 0.98); if ((Math.abs(ty(A.cam) - ty(B.cam)) > 0.5 || Math.abs(tx(A.cam) - tx(B.cam)) > 0.5) && !covered && B.gop > 0.02) snaps++; if (Math.abs(A.gh - B.gh) > 2 && !covered && B.gop > 0.02) reflows++; }
  const fr = keep.filter((f) => f.at >= a - 300 && f.at <= a + 800 && f.diff !== null), fd = fr.map((f) => f.diff), maxDiff = Math.max(0, ...fd);
  const lf = LOAF.filter((l) => l.at >= a - 300 && l.at <= a + 800);
  rows.push({ ev: k, maxDt: +Math.max(0, ...dts).toFixed(1), over20: dts.filter((x) => x > 20).length, over33: dts.filter((x) => x > 33.4).length, snaps, reflows, maxDiff: +maxDiff.toFixed(1), at: fr.length ? +((fr[fd.indexOf(maxDiff)].at - a) / 1000).toFixed(2) : null, loaf: lf.length ? Math.round(Math.max(...lf.map((l) => l.dur))) : 0 });
}
console.log('| transition | max frame ms | >20 ms | >33 ms | snaps | reflows | max frame diff (at s) | longest LoAF ms |'); console.log('|---|---|---|---|---|---|---|---|');
for (const r of rows) console.log(`| ${r.ev} | ${r.maxDt} | ${r.over20} | ${r.over33} | ${r.snaps} | ${r.reflows} | ${r.maxDiff} (${r.at}) | ${r.loaf} |`);
