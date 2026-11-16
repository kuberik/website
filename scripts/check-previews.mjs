#!/usr/bin/env node
// Build check for link previews and site icons. Run after `hugo` on the built site:
//   node scripts/check-previews.mjs [public dir, default ./public]
// Fails (exit 1) when
//   - a built HTML page (redirect stubs aside) lacks og:title, og:description, og:image, og:url, og:type,
//     og:site_name, twitter:card=summary_large_image or twitter:image;
//   - an og:image / twitter:image is not an absolute URL on the site's own host, or does not resolve to a file in
//     the build, or is not a PNG/JPEG of at least 1200x600 at about 1.91:1, or its og:image:width/height disagree;
//   - a page lacks the icon links (icon, apple-touch-icon, manifest), or they point at missing files;
//   - the touch icon is not a 180x180 opaque PNG, the web manifest is not ours (name "Kuberik", 192/512 icons and
//     a maskable one, each file present at its stated size), or any built file is byte-identical to a file in a
//     theme's static/ folder (a theme default leaking into the site).
// No dependencies: Node's standard library only.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pub = resolve(process.argv[2] || join(root, 'public'));
const errors = [];
const fail = (where, msg) => errors.push(`${where}: ${msg}`);

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}

// tags as attribute maps; handles quoted and unquoted (minified) attribute values
function tags(html, name) {
  const out = [];
  for (const m of html.matchAll(new RegExp(`<${name}\\b([^>]*)>`, 'gi'))) {
    const a = {};
    for (const at of m[1].matchAll(/([^\s=/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g))
      a[at[1].toLowerCase()] = (at[2] ?? at[3] ?? at[4] ?? '').replace(/&amp;/g, '&').replace(/&#43;/g, '+');
    out.push(a);
  }
  return out;
}

// width/height of a PNG or JPEG, plus whether a PNG has an alpha channel
function imageInfo(buf) {
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    const colorType = buf[25];
    const hasTRNS = buf.includes(Buffer.from('tRNS'));
    return { type: 'image/png', width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), alpha: colorType === 4 || colorType === 6 || hasTRNS };
  }
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker))
        return { type: 'image/jpeg', height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7), alpha: false };
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  return null;
}

// a site URL (absolute on `host`, or root-relative) to the file it serves in the build
function fileFor(url, host) {
  let u;
  try { u = new URL(url, `https://${host}/`); } catch { return null; }
  if (u.host !== host) return null;
  let p = decodeURIComponent(u.pathname);
  if (p.endsWith('/')) p += 'index.html';
  const f = join(pub, p);
  return existsSync(f) && statSync(f).isFile() ? f : null;
}

if (!existsSync(join(pub, 'index.html'))) { console.error(`check-previews: no built site at ${pub}`); process.exit(2); }
const files = walk(pub);
const pages = files.filter(f => f.endsWith('.html'));
const home = tags(readFileSync(join(pub, 'index.html'), 'utf8'), 'meta').find(m => m.property === 'og:url');
const host = home ? new URL(home.content).host : null;
if (!host) fail('index.html', 'no og:url, so the site host is unknown');

let checked = 0;
const imageChecked = new Map();
for (const f of pages) {
  const html = readFileSync(f, 'utf8');
  const where = relative(pub, f);
  const metas = tags(html, 'meta');
  if (metas.some(m => (m['http-equiv'] || '').toLowerCase() === 'refresh')) continue; // alias redirect stub
  if (!/<head\b/i.test(html)) continue; // fragment, not a page
  checked++;
  const get = k => metas.find(m => m.property === k || m.name === k)?.content?.trim();
  for (const k of ['og:title', 'og:description', 'og:image', 'og:url', 'og:type', 'og:site_name', 'twitter:card', 'twitter:image'])
    if (!get(k)) fail(where, `missing ${k}`);
  if (get('twitter:card') && get('twitter:card') !== 'summary_large_image') fail(where, `twitter:card is "${get('twitter:card')}", want summary_large_image`);
  if (host && get('og:url') && new URL(get('og:url')).host !== host) fail(where, `og:url ${get('og:url')} is not on ${host}`);

  for (const k of ['og:image', 'twitter:image']) {
    const url = get(k);
    if (!url || !host) continue;
    if (!/^https?:\/\//.test(url)) { fail(where, `${k} ${url} is not an absolute URL`); continue; }
    const file = fileFor(url, host);
    if (!file) { fail(where, `${k} ${url} does not resolve to a file in the build`); continue; }
    if (!imageChecked.has(file)) {
      const info = imageInfo(readFileSync(file));
      let problem = null;
      if (!info) problem = 'is not a PNG or JPEG';
      else if (info.width < 1200 || info.height < 600) problem = `is ${info.width}x${info.height}, want at least 1200x630`;
      else if (Math.abs(info.width / info.height - 1.91) > 0.06) problem = `is ${info.width}x${info.height}, want about 1.91:1 (1200x630)`;
      imageChecked.set(file, { info, problem });
    }
    const { info, problem } = imageChecked.get(file);
    if (problem) fail(where, `${k} ${url} ${problem}`);
    if (k === 'og:image' && info) {
      const w = get('og:image:width'), h = get('og:image:height');
      if ((w && +w !== info.width) || (h && +h !== info.height)) fail(where, `og:image:width/height ${w}x${h} disagree with the file (${info.width}x${info.height})`);
    }
  }

  const links = tags(html, 'link');
  const rel = r => links.filter(l => (l.rel || '').toLowerCase().split(/\s+/).includes(r));
  for (const r of ['icon', 'apple-touch-icon', 'manifest']) {
    if (!rel(r).length) { fail(where, `missing <link rel=${r}>`); continue; }
    for (const l of rel(r)) if (host && !fileFor(l.href, host)) fail(where, `<link rel=${r}> ${l.href} does not resolve to a file in the build`);
  }
}

// the touch icon and the manifest
const touch = join(pub, 'apple-touch-icon.png');
if (!existsSync(touch)) fail('apple-touch-icon.png', 'missing');
else {
  const i = imageInfo(readFileSync(touch));
  if (!i || i.type !== 'image/png' || i.width !== 180 || i.height !== 180) fail('apple-touch-icon.png', 'want a 180x180 PNG');
  else if (i.alpha) fail('apple-touch-icon.png', 'has transparency; iOS fills it with black, so the icon must be opaque');
}
const mf = join(pub, 'site.webmanifest');
if (!existsSync(mf)) fail('site.webmanifest', 'missing');
else {
  let m = null;
  try { m = JSON.parse(readFileSync(mf, 'utf8')); } catch (e) { fail('site.webmanifest', `not JSON: ${e.message}`); }
  if (m) {
    if (m.name !== 'Kuberik' || m.short_name !== 'Kuberik') fail('site.webmanifest', `name/short_name are "${m.name}"/"${m.short_name}", want "Kuberik"`);
    for (const k of ['theme_color', 'background_color', 'start_url']) if (!m[k]) fail('site.webmanifest', `missing ${k}`);
    const icons = m.icons || [];
    for (const size of ['192x192', '512x512'])
      if (!icons.some(i => i.sizes === size && (i.purpose || 'any').split(/\s+/).includes('any'))) fail('site.webmanifest', `no ${size} icon`);
    if (!icons.some(i => (i.purpose || '').split(/\s+/).includes('maskable'))) fail('site.webmanifest', 'no maskable icon');
    for (const i of icons) {
      const file = host && fileFor(new URL(i.src, `https://${host}/site.webmanifest`).href, host);
      if (!file) { fail('site.webmanifest', `icon ${i.src} does not resolve to a file in the build`); continue; }
      const info = imageInfo(readFileSync(file));
      if (!info || `${info.width}x${info.height}` !== i.sizes) fail('site.webmanifest', `icon ${i.src} is not ${i.sizes}`);
      if ((i.purpose || '').includes('maskable') && info?.alpha) fail('site.webmanifest', `maskable icon ${i.src} must be opaque`);
    }
  }
}

// nothing the build serves may be a theme's own static file
const themeHashes = new Map();
const themes = join(root, 'themes');
if (existsSync(themes))
  for (const t of readdirSync(themes)) {
    const s = join(themes, t, 'static');
    if (existsSync(s)) for (const f of walk(s)) themeHashes.set(createHash('sha256').update(readFileSync(f)).digest('hex'), `themes/${t}/static/${relative(s, f)}`);
  }
for (const f of files) {
  const src = themeHashes.get(createHash('sha256').update(readFileSync(f)).digest('hex'));
  if (src) fail(relative(pub, f), `is the theme's ${src}`);
}

if (errors.length) {
  console.error(`check-previews: ${errors.length} problem(s) in ${pub}`);
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
}
console.log(`check-previews: ok, ${checked} pages with link previews and icons, ${imageChecked.size} preview image(s), manifest and touch icon are ours`);
