// node strip.mjs (after jitter.mjs) <rundir> <event> <out.png> [from=-0.1] [to=0.6] : the screencast frames (every swapped frame, ~60 fps) of one transition, labelled ms and frame diff
import fs from 'fs'; import { execFileSync } from 'child_process';
const [d, ev, out, a0 = '-0.1', a1 = '0.6'] = process.argv.slice(2);
const { evAt, clip } = JSON.parse(fs.readFileSync(d + '/raf.json')); const fr = JSON.parse(fs.readFileSync(d + '/frames.json')); const a = evAt[ev];
const sel = fr.filter((f) => f.at >= a + a0 * 1000 && f.at <= a + a1 * 1000);
const args = []; for (const f of sel) args.push('-label', `${Math.round(f.at - a)}ms d${(f.diff ?? 0).toFixed(1)}`, `${d}/${f.name}[${Math.round(clip.w)}x${Math.round(clip.h)}+${Math.round(clip.x)}+${Math.round(clip.y)}]`);
execFileSync('montage', [...args, '-geometry', `${clip.w > 600 ? 240 : 130}x+2+2`, '-tile', '12x', '-pointsize', '10', out]); console.log(sel.length, 'frames ->', out);
