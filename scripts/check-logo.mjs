#!/usr/bin/env node
// Logo check: the light-theme logo has white eyes; the dark theme and the favicon keep dark eyes (#181a22).
//   node scripts/check-logo.mjs [public dir, default ./public]          the build check (CI)
//   node scripts/check-logo.mjs --embedded <dir>                       only the embedded-logo rule, over one directory
//                                                                       (islands/build.sh runs it on static/islands/)
//   node scripts/check-logo.mjs --scan <file or dir>...                 report every logo found in images (audit)
// Fails (exit 1) when
//   - static/logo-light.svg or static/logo.svg has eyes that are not white, or static/logo-dark.svg or
//     static/favicon.svg has eyes that are not #181a22;
//   - a built file (HTML, JS, CSS, SVG) embeds the kuberik logo (as markup or as a data: URL, e.g. the hero film's
//     compiled dashboard bundle) that is neither the site's static/logo-light.svg nor static/logo-dark.svg, or a
//     file that embeds the dark variant does not also embed the light one (a light theme drawing dark eyes);
//   - a raster image in the build (PNG, JPEG, WebP) whose name does not say "dark" shows the logo on a light
//     background with dark eyes. Images are decoded with ffmpeg, which must be on the PATH.
// Release post images (images under a page that `content/blog/` links) are reported but never fail the check: they
// keep the screenshots they were published with.
// No npm dependencies: Node's standard library and ffmpeg.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { eyeFills } from './logo-eyes.mjs';
import { execFileSync, execFile } from 'node:child_process';
import { availableParallelism } from 'node:os';
import { promisify } from 'node:util';
const run = promisify(execFile);
import { join, relative, resolve, dirname, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const WHITE = /^#(fff|ffffff)$/i;
const DARK = /^#181a22$/i;

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}

// ---------- vector: the eye fills of an SVG logo's markup ----------
const norm = (s) => s.replace(/<\?xml[^>]*\?>/, '').replace(/'/g, '"').replace(/\s+/g, ' ').replace(/> </g, '><').trim();

// Every logo embedded in a built text file: data:image/svg+xml URLs (URL- or base64-encoded) and inline <svg>.
function embeddedLogos(text) {
  const out = [];
  // the URL runs to the quote that opened it (a URL-encoded SVG may contain the other quote), or to ")" when unquoted
  for (const m of text.matchAll(/(["'`(])data:image\/svg\+xml(;base64)?,/g)) {
    const close = m[1] === '(' ? ')' : m[1];
    const start = m.index + m[0].length;
    let end = text.indexOf(close, start);
    if (end < 0) end = text.length;
    let svg;
    const body = text.slice(start, end).trim();
    try { svg = m[2] ? Buffer.from(body, 'base64').toString('utf8') : decodeURIComponent(body); } catch { continue; }
    if (/lgradface/.test(svg)) out.push(svg);
  }
  for (const m of text.matchAll(/<svg\b[\s\S]*?<\/svg>/g)) if (/lgradface/.test(m[0])) out.push(m[0]);
  return out;
}

// ---------- raster: find the logo by its teal and read its eyes ----------
// one ffmpeg call per frame: a PAM image carries its own width and height
async function decode(file, at) {
  const args = ['-v', 'error', '-threads', '1', '-filter_threads', '1'];
  if (at != null) args.push('-ss', String(at));
  args.push('-i', file, '-frames:v', '1', '-f', 'image2pipe', '-c:v', 'pam', '-pix_fmt', 'rgba', '-');
  const { stdout: buf } = await run('ffmpeg', args, { maxBuffer: 1 << 30, encoding: 'buffer' });
  const end = buf.indexOf('ENDHDR\n');
  const head = buf.subarray(0, end).toString();
  const w = Number(head.match(/WIDTH (\d+)/)[1]), h = Number(head.match(/HEIGHT (\d+)/)[1]);
  return { w, h, px: buf.subarray(end + 7, end + 7 + w * h * 4) };
}
const luma = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

// The logo's teal runs rgb(0,201,181) to rgb(0,178,194); dark builds add rgb(69,140,153).
function isTeal(r, g, b, a) {
  return a > 200 && r < 110 && g > 120 && b > 130 && g - r > 70 && b - r > 70 && Math.abs(g - b) < 60;
}

// Geometry in the SVG's 800 x 980 viewBox.
const LOGO = { x0: 9.3, x1: 789.8, y0: 15.3, y1: 965.2 }; // hat + face
const FACE = { x0: 122.4, x1: 677.9, y0: 486, y1: 965.2 };
const EYES = [{ x: 288.69, y: 678.85 }, { x: 525.31, y: 678.85 }];
const EYE_R = 36;

function findLogos(img) {
  const { w, h, px } = img;
  const mask = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) if (isTeal(px[4 * i], px[4 * i + 1], px[4 * i + 2], px[4 * i + 3])) mask[i] = 1;
  // dilate by one pixel so a small logo's hat and face (a gap of 2.5 % of its height) join
  const dil = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (!mask[y * w + x]) continue;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const X = x + dx, Y = y + dy;
      if (X >= 0 && Y >= 0 && X < w && Y < h) dil[Y * w + X] = 1;
    }
  }
  const seen = new Uint8Array(w * h);
  const comps = [];
  const stack = [];
  for (let i = 0; i < w * h; i++) {
    if (!dil[i] || seen[i]) continue;
    let minx = w, maxx = -1, miny = h, maxy = -1, n = 0;
    stack.push(i); seen[i] = 1;
    while (stack.length) {
      const j = stack.pop();
      const x = j % w, y = (j - x) / w;
      if (mask[j]) { n++; if (x < minx) minx = x; if (x > maxx) maxx = x; if (y < miny) miny = y; if (y > maxy) maxy = y; }
      if (x > 0 && dil[j - 1] && !seen[j - 1]) { seen[j - 1] = 1; stack.push(j - 1); }
      if (x < w - 1 && dil[j + 1] && !seen[j + 1]) { seen[j + 1] = 1; stack.push(j + 1); }
      if (y > 0 && dil[j - w] && !seen[j - w]) { seen[j - w] = 1; stack.push(j - w); }
      if (y < h - 1 && dil[j + w] && !seen[j + w]) { seen[j + w] = 1; stack.push(j + w); }
    }
    if (maxx < 0) continue;
    const bw = maxx - minx + 1, bh = maxy - miny + 1;
    if (bh < (Number(process.env.LOGO_MIN_H) || 7)) continue;
    comps.push({ minx, miny, bw, bh, n });
  }
  const found = [];
  for (const c of comps) {
    const aspect = c.bw / c.bh;
    // a whole logo (hat + face) is 0.82 wide per tall; a face alone (a large logo whose hat did not join) is 1.16
    const geo = aspect > 0.58 && aspect < 0.95 ? LOGO : aspect > 1.05 && aspect < 1.3 ? FACE : null;
    if (!geo) continue;
    const fill = c.n / (c.bw * c.bh);
    if (fill < 0.45 || fill > 0.9) continue;
    const sx = c.bw / (geo.x1 - geo.x0), sy = c.bh / (geo.y1 - geo.y0);
    // search a little around each eye (rounding moves a small logo's eye by a pixel) and read its non-teal pixels
    const rr = Math.max(1, Math.round(EYE_R * sx * 0.8));
    const eyes = EYES.map((e) => {
      const cx = Math.round(c.minx + (e.x - geo.x0) * sx), cy = Math.round(c.miny + (e.y - geo.y0) * sy);
      let lo = 255, hi = 0, k = 0, all = 0;
      for (let dy = -rr; dy <= rr; dy++) for (let dx = -rr; dx <= rr; dx++) {
        const X = cx + dx, Y = cy + dy;
        if (X < 0 || Y < 0 || X >= w || Y >= h) continue;
        all++;
        const q = 4 * (Y * w + X);
        if (isTeal(px[q], px[q + 1], px[q + 2], px[q + 3])) continue;
        const l = luma(px[q], px[q + 1], px[q + 2]);
        if (l < lo) lo = l; if (l > hi) hi = l; k++;
      }
      return { x: cx, y: cy, lo, hi, k, teal: all ? 1 - k / all : 1 };
    });
    // nothing but teal where both eyes should be: not the logo (below ~16 px one eye can blur into the face)
    const seen2 = eyes.filter((e) => e.k > 0);
    if (!seen2.length) continue;
    // the background: a ring just outside the box
    let s = 0, k = 0;
    const pad = Math.max(2, Math.round(c.bh * 0.15));
    const ring = (X, Y) => { if (X >= 0 && Y >= 0 && X < w && Y < h) { const q = 4 * (Y * w + X); if (px[q + 3] > 200) { s += luma(px[q], px[q + 1], px[q + 2]); k++; } } };
    for (let y = c.miny - pad; y < c.miny + c.bh + pad; y++) { ring(c.minx - pad, y); ring(c.minx + c.bw + pad - 1, y); }
    for (let x = c.minx - pad; x < c.minx + c.bw + pad; x++) { ring(x, c.miny - pad); ring(x, c.miny + c.bh + pad - 1); }
    const bg = k ? s / k : null;
    const eye = Math.min(...seen2.map((e) => e.lo));
    const eyesAre = eye < 110 ? 'dark' : Math.min(...seen2.map((e) => e.hi)) > 185 ? 'white' : 'unclear';
    found.push({ box: [c.minx, c.miny, c.bw, c.bh], eyes: eyesAre, eyeLuma: Math.round(eye), bg: bg == null ? null : Math.round(bg) });
  }
  return found;
}

// light background + dark eyes, or dark background + white eyes = the defect (a transparent layer takes its theme from its name)
function verdict(file, logo) {
  const nameTheme = /dark/i.test(basename(file)) ? 'dark' : /light/i.test(basename(file)) ? 'light' : null;
  const theme = logo.bg != null ? (logo.bg > 140 ? 'light' : logo.bg < 90 ? 'dark' : nameTheme || 'unclear') : nameTheme || 'unclear';
  if (theme === 'light' && logo.eyes === 'dark') return { theme, ok: false, says: 'WRONG: dark eyes in light' };
  if (theme === 'light' && logo.eyes === 'white') return { theme, ok: true, says: 'right: white eyes in light' };
  if (theme === 'dark' && logo.eyes === 'dark') return { theme, ok: true, says: 'right: dark eyes in dark' };
  if (theme === 'dark' && logo.eyes === 'white') return { theme, ok: false, says: 'WRONG: white eyes in dark' };
  return { theme, ok: true, says: `unclear (theme ${theme}, eyes ${logo.eyes})` };
}

const RASTER = new Set(['.png', '.jpg', '.jpeg', '.webp']);
const VIDEO = new Set(['.mp4', '.webm', '.mov']);

async function scanImage(file) {
  const ext = extname(file).toLowerCase();
  const frames = [];
  if (VIDEO.has(ext)) {
    const dur = Number((await run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file])).stdout.toString().trim()) || 0;
    for (let t = 0; t < dur; t += 2) frames.push(t);
  } else frames.push(null);
  const rows = [];
  for (const t of frames) {
    let img;
    try { img = await decode(file, t); } catch (e) { rows.push({ file, t, error: String(e.message || e).split('\n')[0] }); continue; }
    for (const logo of findLogos(img)) rows.push({ file, t, ...logo, ...verdict(file, logo) });
  }
  return rows;
}

function haveFfmpeg() {
  try { execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' }); execFileSync('ffprobe', ['-version'], { stdio: 'ignore' }); return true; } catch { return false; }
}

// decode a few images at a time; results keep the files' order
async function scanAll(files) {
  const out = new Array(files.length);
  let next = 0;
  const lanes = Math.max(1, Math.min(8, availableParallelism()));
  await Promise.all(Array.from({ length: lanes }, async () => {
    while (next < files.length) { const i = next++; out[i] = await scanImage(files[i]); }
  }));
  return out;
}

// ---------- --scan: audit mode ----------
if (process.argv[2] === '--scan') {
  const files = process.argv.slice(3).flatMap((p) => (statSync(p).isDirectory() ? walk(p) : [p]))
    .filter((f) => RASTER.has(extname(f).toLowerCase()) || VIDEO.has(extname(f).toLowerCase())).sort();
  let wrong = 0;
  const results = await scanAll(files);
  for (const [k, f] of files.entries()) {
    const rows = results[k];
    if (!rows.length) { console.log(`${f}\t-\tno logo`); continue; }
    for (const r of rows) {
      if (r.error) { console.log(`${f}\t${r.t ?? ''}\terror: ${r.error}`); continue; }
      if (!r.ok) wrong++;
      console.log(`${f}${r.t != null ? `@${r.t}s` : ''}\t${r.box.join(',')}\teyes ${r.eyes} (luma ${r.eyeLuma}) bg ${r.bg}\t${r.says}`);
    }
  }
  console.log(`${files.length} files, ${wrong} wrong`);
  process.exit(wrong ? 1 : 0);
}

// ---------- build check ----------
const pub = resolve(process.argv[2] || join(root, 'public'));
const errors = [];
const notes = [];
const fail = (where, msg) => errors.push(`${where}: ${msg}`);

// every logo embedded in a text file must be one of the site's pair, and a file that embeds the dark one must also
// embed the light one
function checkEmbedded(dir, skipOwn) {
  const L = norm(readFileSync(join(root, 'static/logo-light.svg'), 'utf8')), D = norm(readFileSync(join(root, 'static/logo-dark.svg'), 'utf8'));
  let embedded = 0;
  for (const f of walk(dir).filter((f) => /\.(html|js|mjs|css|svg)$/i.test(f))) {
    const rel = relative(dir, f);
    if (skipOwn && /^logo[-.]|^favicon/.test(basename(f)) && dirname(rel) === '.') continue; // the site's own logo files, checked above
    const text = readFileSync(f, 'utf8');
    if (!/lgradface/.test(text)) continue;
    let light = 0, dark = 0;
    for (const svg of embeddedLogos(text)) {
      embedded++;
      const n = norm(svg);
      if (n === L) { light++; continue; }
      if (n === D) { dark++; continue; }
      const fills = eyeFills(svg);
      if (fills.length && fills.every((x) => WHITE.test(x))) { light++; continue; }
      if (fills.length && fills.every((x) => DARK.test(x))) { dark++; continue; }
      fail(rel, `embeds a logo whose eyes are ${fills.join(', ') || 'unknown'}`);
    }
    if (dark && !light) fail(rel, `embeds the dark-eyed logo ${dark}x and no white-eyed one: its light theme draws dark eyes (rebuild it from a dashboard whose logo-rotate-light.svg has white eyes)`);
  }
  return embedded;
}

if (process.argv[2] === '--embedded') {
  const dir = resolve(process.argv[3] || '.');
  const n = checkEmbedded(dir, false);
  if (errors.length) { console.error(`logo check failed (${errors.length}):`); for (const e of errors) console.error(`  ${e}`); process.exit(1); }
  console.log(`logo check ok: ${n} embedded logos in ${dir}`);
  process.exit(0);
}


// every logo file the site publishes: a name that says dark keeps #181a22, any other is drawn on light and has white eyes
const logoFiles = readdirSync(join(root, 'static')).filter((n) => /^logo([-.].*)?\.svg$/.test(n)).map((n) => `static/${n}`);
for (const need of ['static/logo.svg', 'static/logo-light.svg', 'static/logo-dark.svg']) if (!logoFiles.includes(need)) fail(need, 'missing');
for (const [f, want, re] of logoFiles.map((f) => /dark/.test(basename(f)) ? [f, '#181a22', DARK] : [f, 'white', WHITE])) {
  const fills = eyeFills(readFileSync(join(root, f), 'utf8'));
  if (fills.length !== 3 || !fills.every((x) => re.test(x))) fail(f, `eyes and gear must be ${want}, found ${fills.join(', ') || 'none'}`);
}
{
  const fav = readFileSync(join(root, 'static/favicon.svg'), 'utf8');
  const fills = eyeFills(fav);
  if (fills.length && !fills.every((x) => DARK.test(x))) fail('static/favicon.svg', `eyes must be #181a22, found ${fills.join(', ')}`);
}

if (!existsSync(pub)) { console.error(`no build at ${pub}; run hugo first`); process.exit(2); }
const all = walk(pub);
const embedded = checkEmbedded(pub, true);
// rasters
let images = 0;
if (!haveFfmpeg()) fail('ffmpeg', 'not on the PATH; the raster half of this check needs ffmpeg and ffprobe');
else {
  // release posts keep the screenshots they shipped with: collect the images their pages use
  const blog = new Set();
  const blogDir = join(pub, 'blog');
  if (existsSync(blogDir)) {
    for (const f of walk(blogDir).filter((f) => f.endsWith('.html'))) {
      if (relative(blogDir, f) === 'index.html' || /^page\//.test(relative(blogDir, f))) continue;
      const html = readFileSync(f, 'utf8');
      for (const m of html.matchAll(/(?:src|href|content)=["']?([^"'\s>]+\.(?:png|jpe?g|webp))/gi)) {
        const u = m[1].replace(/^https?:\/\/[^/]+/, '').split('?')[0];
        if (u.startsWith('/')) blog.add(u.slice(1));
      }
    }
  }
  const media = all.filter((f) => RASTER.has(extname(f).toLowerCase()) || VIDEO.has(extname(f).toLowerCase()))
    .filter((f) => !/^(android-chrome|apple-touch-icon|favicon)/.test(basename(f))); // the icons keep dark eyes
  const results = await scanAll(media);
  for (const [k, f] of media.entries()) {
    const rel = relative(pub, f);
    images++;
    for (const r of results[k]) {
      if (r.error) { fail(rel, `cannot decode: ${r.error}`); continue; }
      if (r.ok) continue;
      const where = `${rel}${r.t != null ? `@${r.t}s` : ''} at ${r.box.join(',')}`;
      if (blog.has(rel.split('/').join('/')) && !/^images\/og\//.test(rel)) notes.push(`${where}: ${r.says} (release post image, kept as published)`);
      else fail(where, r.says);
    }
  }
}

for (const n of notes) console.log(`note: ${n}`);
if (errors.length) {
  console.error(`logo check failed (${errors.length}):`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}
console.log(`logo check ok: logo files, ${embedded} embedded logos, ${images} images`);
