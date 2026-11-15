#!/usr/bin/env node
// Docs figures generator: writes layouts/_partials/docs-figs/<id>.html (one wide + one narrow SVG per figure).
// Grammar and colours: see the doc comment in layouts/_shortcodes/fig.html and assets/css/docs-figs.css.
// Run: node scripts/docs-figs.mjs   (edit this file, never the generated partials)
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'layouts/_partials/docs-figs');
mkdirSync(outDir, { recursive: true });

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const n = (v) => Math.round(v * 100) / 100;

// ---------- primitives ----------
// plate: an object (resource, controller, external system). kind: k = Kuberik (mint), f = Flux / external (lagoon),
// n = neutral (your workload, a registry). key = the object the figure is about (1.5 mint stroke).
// title Inter 13/600; sub lines Inter 13 ink-muted (mono: true for field names). Every label is 13 at 1440 (STYLE 6).
// With a state chip in place of the title, the chip sits at y+20 and the sub lines start 4 lower (y+46).
function plate({ x, y, w, h, kind = 'n', title, sub = [], mono = false, key = false, chip, dashed = false, subTop }) {
  const subs = Array.isArray(sub) ? sub : [sub];
  const H = h ?? (subs.length ? 40 + subs.length * 16 : 40);
  let s = `<g class="df-plate df-${kind}${key ? ' is-key' : ''}${dashed ? ' is-dashed' : ''}">`;
  s += `<rect x="${x}" y="${y}" width="${w}" height="${H}" rx="8"/>`;
  let ty = subs.length ? y + 24 : y + H / 2 + 4.5;
  if (chip) {
    s += chipSvg({ x: x + 14, cy: subs.length ? y + 20 : y + H / 2, text: chip.text, state: chip.state, anchor: 'start' });
  } else if (title) {
    s += `<text class="df-title" x="${x + 14}" y="${ty}">${esc(title)}</text>`;
  }
  subs.forEach((t, i) => {
    const m = mono || t.startsWith('`');
    s += `<text class="df-sub${m ? ' is-mono' : ''}" x="${x + 14}" y="${y + (subTop ?? (chip ? 46 : 42)) + i * 16}">${esc(t.replace(/`/g, ''))}</text>`;
  });
  return s + '</g>';
}

// chip: the product chip, at figure scale: 22 tall, radius 4, 13 600 uppercase .04em (the dashboard's is 11; a
// figure label never goes under 13 at 1440). Width from a per-character estimate,
// text centred so an estimate error only changes the padding.
const CHIP_CH = 9.6;
function chipW(text) { return Math.round(text.length * CHIP_CH + 16); }
function chipSvg({ x, cy, text, state = 'gray', anchor = 'middle' }) {
  const w = chipW(text);
  const x0 = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
  return `<g class="df-chip df-chip-${state}"><rect x="${n(x0)}" y="${cy - 11}" width="${w}" height="22" rx="4"/>` +
    `<text x="${n(x0 + w / 2)}" y="${cy + 4.5}" text-anchor="middle">${esc(text.toUpperCase())}</text></g>`;
}

// pill: a version tag (mono 13, radius 4) – the dashboard's tag token.
function pill({ x, y, text, state = 'gray' }) {
  const w = Math.round(text.length * 7.8 + 16);
  return `<g class="df-pill df-pill-${state}"><rect x="${x}" y="${y}" width="${w}" height="22" rx="4"/>` +
    `<text x="${n(x + w / 2)}" y="${y + 15}" text-anchor="middle">${esc(text)}</text></g>`;
}

// edge: an arrow along points, corners rounded (r 8, the landing Gates wire), open chevron head.
// kind: ink (default, ink-subtle), act (Kuberik writes: mint), held (amber), pass (green).
function edge(pts, { kind = 'ink', dashed = false, head = true, label, r = 8 } = {}) {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i];
    if (i < pts.length - 1) {
      const a = pts[i - 1], b = pts[i + 1];
      const l1 = Math.hypot(p[0] - a[0], p[1] - a[1]), l2 = Math.hypot(b[0] - p[0], b[1] - p[1]);
      const rr = Math.min(r, l1 / 2, l2 / 2);
      const p1 = [p[0] - (p[0] - a[0]) / l1 * rr, p[1] - (p[1] - a[1]) / l1 * rr];
      const p2 = [p[0] + (b[0] - p[0]) / l2 * rr, p[1] + (b[1] - p[1]) / l2 * rr];
      d += `L${n(p1[0])} ${n(p1[1])}Q${p[0]} ${p[1]} ${n(p2[0])} ${n(p2[1])}`;
    } else d += `L${p[0]} ${p[1]}`;
  }
  let s = `<g class="df-edge df-e-${kind}${dashed ? ' is-dashed' : ''}"><path d="${d}"/>`;
  if (head) {
    const e = pts[pts.length - 1], q = pts[pts.length - 2];
    const L = Math.hypot(e[0] - q[0], e[1] - q[1]);
    const ux = (e[0] - q[0]) / L, uy = (e[1] - q[1]) / L;
    const bx = e[0] - ux * 6, by = e[1] - uy * 6;
    s += `<path class="df-head" d="M${n(bx - uy * 4.5)} ${n(by + ux * 4.5)}L${e[0]} ${e[1]}L${n(bx + uy * 4.5)} ${n(by - ux * 4.5)}"/>`;
  }
  s += '</g>';
  if (label) s += text(label);
  return s;
}

// text: free label. role: label (Inter 13 ink-muted, haloed so it can sit on a line), mono, note.
function text({ x, y, t, anchor = 'start', role = 'label', lines }) {
  const ls = lines ?? (Array.isArray(t) ? t : [t]);
  return ls.map((l, i) => `<text class="df-${role}" x="${x}" y="${y + i * 16}"${anchor !== 'start' ? ` text-anchor="${anchor}"` : ''}>${esc(l)}</text>`).join('');
}

// group: a region (a cluster, or who owns the objects). Dashed 1px line, radius 12, label 13/600 uppercase .04em
// in the owner's ink (mint Kuberik, lagoon Flux, ink-subtle otherwise), or an environment chip.
function group({ x, y, w, h, label, kind = 'n', chip }) {
  let s = `<g class="df-group df-g-${kind}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12"/>`;
  if (chip) s += chipSvg({ x: x + 12, cy: y + 18, text: chip.text, state: chip.state, anchor: 'start' });
  if (label) s += `<text class="df-glabel" x="${chip ? x + 20 + chipW(chip.text) : x + 14}" y="${y + 22}">${esc(label)}</text>`;
  return s + '</g>';
}

// note: a footnote row under a hairline: a small dot in a state colour, then 13/16 ink-muted text.
function notes({ x, y, w, items }) {
  let s = `<path class="df-rule" d="M${x} ${y}H${x + w}"/>`;
  items.forEach((it, i) => {
    const yy = y + 24 + i * 22;
    s += `<circle class="df-dot df-dot-${it.state || 'gray'}" cx="${x + 4}" cy="${yy - 4}" r="3.5"/>`;
    s += `<text class="df-note" x="${x + 16}" y="${yy}"><tspan class="df-note-k">${esc(it.k)}</tspan>${it.v ? ' ' + esc(it.v) : ''}</text>`;
  });
  return s;
}

function svg(id, variant, { w, h, body }, title, desc) {
  const tid = `df-${id}-${variant}-t`, did = `df-${id}-${variant}-d`;
  return `<svg class="df-svg df-${variant}" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-labelledby="${tid} ${did}">` +
    `<title id="${tid}">${esc(title)}</title><desc id="${did}">${esc(desc)}</desc>${body}</svg>`;
}

const figs = {};

// ============ architecture: Kuberik picks the version, Flux applies it ============
figs.architecture = {
  title: 'Kuberik picks the version, Flux applies it',
  desc: 'Inside Kuberik, a ReleaseSource lists the release tags, RolloutGates allow versions and HealthChecks report health; all three feed the Rollout, which picks the version. The Rollout moves the tag of a Flux OCIRepository or sets a version substitute on a Flux Kustomization. The OCIRepository feeds the Kustomization, which applies your workload.',
  wide: {
    w: 632, h: 312, body: [
      group({ x: 0, y: 0, w: 344, h: 240, label: 'Kuberik', kind: 'k' }),
      group({ x: 464, y: 0, w: 168, h: 240, label: 'Flux', kind: 'f' }),
      plate({ x: 12, y: 36, w: 140, kind: 'k', title: 'ReleaseSource', sub: 'lists release tags' }),
      plate({ x: 12, y: 104, w: 140, kind: 'k', title: 'RolloutGate', sub: 'allows versions' }),
      plate({ x: 12, y: 172, w: 140, kind: 'k', title: 'HealthCheck', sub: 'reports health' }),
      plate({ x: 192, y: 104, w: 140, kind: 'k', key: true, title: 'Rollout', sub: 'picks the version' }),
      edge([[152, 64], [172, 64], [172, 118], [189, 118]]),
      edge([[152, 132], [189, 132]]),
      edge([[152, 200], [172, 200], [172, 146], [189, 146]]),
      plate({ x: 476, y: 36, w: 144, kind: 'f', title: 'OCIRepository', sub: 'fetches the artifact' }),
      plate({ x: 476, y: 172, w: 144, kind: 'f', title: 'Kustomization', sub: 'applies manifests' }),
      edge([[548, 92], [548, 169]]),
      edge([[332, 122], [366, 122], [366, 64], [473, 64]], { kind: 'act', label: { x: 420, y: 56, t: 'moves tag', anchor: 'middle' } }),
      edge([[332, 142], [366, 142], [366, 200], [473, 200]], { kind: 'act', label: { x: 420, y: 192, t: 'sets version', anchor: 'middle' } }),
      plate({ x: 476, y: 272, w: 144, kind: 'n', title: 'Workload' }),
      edge([[548, 228], [548, 269]]),
    ].join('')
  },
  narrow: {
    w: 318, h: 410, body: [
      group({ x: 0, y: 0, w: 318, h: 196, label: 'Kuberik', kind: 'k' }),
      plate({ x: 12, y: 36, w: 136, kind: 'k', title: 'RolloutGate', sub: 'allows versions' }),
      plate({ x: 170, y: 36, w: 136, kind: 'k', title: 'HealthCheck', sub: 'reports health' }),
      plate({ x: 12, y: 128, w: 136, kind: 'k', title: 'ReleaseSource', sub: 'lists release tags' }),
      plate({ x: 170, y: 128, w: 136, kind: 'k', key: true, title: 'Rollout', sub: 'picks the version' }),
      edge([[80, 92], [80, 110], [214, 110], [214, 125]]),
      edge([[262, 92], [262, 125]]),
      edge([[148, 156], [167, 156]]),
      edge([[214, 184], [214, 214], [80, 214], [80, 273]], { kind: 'act', label: { x: 147, y: 208, t: 'moves tag', anchor: 'middle' } }),
      edge([[262, 184], [262, 273]], { kind: 'act', label: { x: 254, y: 236, t: 'sets version', anchor: 'end' } }),
      group({ x: 0, y: 244, w: 318, h: 112, label: 'Flux', kind: 'f' }),
      plate({ x: 12, y: 276, w: 142, kind: 'f', title: 'OCIRepository', sub: 'fetches the artifact' }),
      plate({ x: 166, y: 276, w: 140, kind: 'f', title: 'Kustomization', sub: 'applies manifests' }),
      edge([[154, 304], [163, 304]]),
      plate({ x: 170, y: 370, w: 136, kind: 'n', title: 'Workload' }),
      edge([[238, 332], [238, 367]]),
    ].join('')
  }
};

// ============ rollout-gating: gates filter the candidates, the newest allowed one deploys ============
const gatingNotes = [
  { k: 'First deploy:', v: 'never held; the newest allowed release, else the newest.', state: 'gray' },
  { k: 'Deploy by hand (wantedVersion, force-deploy):', v: 'gates are skipped.', state: 'gray' },
  { k: 'A HealthCheck is Unhealthy:', v: 'held, DeploymentBlocked=True.', state: 'amber' },
];
figs['rollout-gating'] = {
  title: 'RolloutGates filter the release candidates; the newest allowed version deploys',
  desc: 'Three release candidates, 1.6.0, 1.5.0 and 1.4.0, reach the RolloutGates. A gate whose allowedVersions lists only 1.5.0 and 1.4.0 holds 1.6.0. The newest allowed candidate, 1.5.0, deploys. When no candidate is allowed, or a gate has passing: false, the Rollout is held and re-evaluated when a gate changes; there is no polling and no reject state. Notes: a first deploy is never held, it takes the newest allowed release or else the newest; on a deploy by hand gates are skipped; an Unhealthy HealthCheck also holds automatic deploys and sets DeploymentBlocked=True.',
  wide: {
    w: 632, h: 330, body: [
      text({ x: 0, y: 14, t: 'RELEASE CANDIDATES', role: 'glabel' }),
      pill({ x: 0, y: 32, text: '1.6.0' }),
      pill({ x: 0, y: 76, text: '1.5.0' }),
      pill({ x: 0, y: 120, text: '1.4.0' }),
      edge([[56, 43], [176, 43]], { kind: 'held', head: false }),
      `<path class="df-stop" d="M176 36v14"/>`,
      edge([[56, 87], [181, 87]], { kind: 'pass' }),
      edge([[56, 131], [181, 131]], { kind: 'pass' }),
      plate({ x: 184, y: 24, w: 188, h: 136, kind: 'k', title: 'RolloutGate', sub: ['passing: true', 'allowedVersions:', '- 1.5.0', '- 1.4.0'], mono: true }),
      edge([[372, 87], [424, 87]], { kind: 'pass' }),
      plate({ x: 428, y: 52, w: 204, kind: 'k', key: true, title: 'Rollout', sub: ['deploys 1.5.0,', 'the newest allowed'] }),
      plate({ x: 428, y: 152, w: 204, kind: 'n', dashed: true, chip: { text: 'Held', state: 'amber' }, sub: ['evaluated again when', 'a gate changes'] }),
      edge([[278, 160], [278, 180], [425, 180]], { kind: 'held', dashed: true }),
      text({ x: 268, y: 186, t: ['otherwise: no candidate', 'allowed, or passing: false'], role: 'label', anchor: 'end' }),
      notes({ x: 0, y: 250, w: 632, items: gatingNotes }),
    ].join('')
  },
  narrow: {
    w: 318, h: 414, body: [
      text({ x: 0, y: 14, t: 'RELEASE CANDIDATES', role: 'glabel' }),
      pill({ x: 0, y: 26, text: '1.6.0' }),
      pill({ x: 104, y: 26, text: '1.5.0' }),
      pill({ x: 208, y: 26, text: '1.4.0' }),
      edge([[28, 48], [28, 76]], { kind: 'held', head: false }),
      `<path class="df-stop" d="M21 76h14"/>`,
      edge([[132, 48], [132, 79]], { kind: 'pass' }),
      edge([[236, 48], [236, 79]], { kind: 'pass' }),
      plate({ x: 0, y: 82, w: 318, h: 88, kind: 'k', title: 'RolloutGate', sub: ['passing: true', 'allowedVersions: [1.5.0, 1.4.0]'], mono: true }),
      edge([[80, 170], [80, 205]], { kind: 'pass' }),
      edge([[238, 170], [238, 205]], { kind: 'held' }),
      plate({ x: 0, y: 208, w: 152, kind: 'k', key: true, title: 'Rollout', sub: ['deploys 1.5.0,', 'newest allowed'] }),
      plate({ x: 166, y: 208, w: 152, kind: 'n', dashed: true, chip: { text: 'Held', state: 'amber' }, sub: ['nothing allowed;', 'evaluated again', 'on any change'] }),
      notes({ x: 0, y: 316, w: 318, items: [
        { k: 'First deploy:', v: 'never held.', state: 'gray' },
        { k: 'Deploy by hand:', v: 'gates skipped.', state: 'gray' },
        { k: 'HealthCheck Unhealthy:', v: 'held,', state: 'amber' },
      ] }),
      text({ x: 16, y: 404, t: 'DeploymentBlocked=True.', role: 'note' }),
    ].join('')
  }
};

// ============ rollout-bake: the history[0].bakeStatus state machine ============
figs['rollout-bake'] = {
  title: 'How a deploy is verified: the bake status of the newest history entry',
  desc: 'A deploy starts in Deploying. When every selected HealthCheck is Healthy after the deploy it moves to InProgress and the bake time runs. When bakeTime passes without an error it is Succeeded. A HealthCheck error after the deploy fails it from Deploying or InProgress, and so does deployTimeout passing before the bake starts. A Failed bake goes back to Deploying with the rollout.kuberik.com/retry annotation. A deploy started by hand cancels a Deploying or InProgress bake, and BakeFailureDisabled=True suppresses failing.',
  wide: {
    w: 632, h: 318, body: [
      plate({ x: 0, y: 0, w: 150, kind: 'n', chip: { text: 'Deploying', state: 'blue' }, sub: 'waits for health' }),
      plate({ x: 241, y: 0, w: 150, kind: 'n', chip: { text: 'InProgress', state: 'yellow' }, sub: 'bakeTime runs' }),
      plate({ x: 482, y: 0, w: 150, kind: 'n', chip: { text: 'Succeeded', state: 'green' }, sub: 'next version may go' }),
      edge([[150, 36], [238, 36]], { kind: 'ink' }),
      text({ x: 195, y: 14, t: ['every check', 'Healthy'], anchor: 'middle' }),
      edge([[391, 36], [479, 36]], { kind: 'ink' }),
      text({ x: 436, y: 14, t: ['bakeTime', 'passed'], anchor: 'middle' }),
      plate({ x: 241, y: 148, w: 150, kind: 'n', chip: { text: 'Failed', state: 'red' }, sub: ['automatic deploys', 'stop here'] }),
      edge([[316, 56], [316, 145]], { kind: 'ink' }),
      text({ x: 324, y: 96, t: ['a HealthCheck', 'errors'] }),
      edge([[120, 56], [120, 168], [238, 168]], { kind: 'ink' }),
      text({ x: 128, y: 160, t: 'deployTimeout' }),
      edge([[241, 204], [48, 204], [48, 59]], { kind: 'ink', dashed: true }),
      text({ x: 56, y: 238, t: 'rollout.kuberik.com/retry', role: 'mono' }),
      notes({ x: 0, y: 260, w: 632, items: [
        { k: 'Cancelled:', v: 'a deploy by hand replaces a Deploying or InProgress bake.', state: 'gray' },
        { k: 'BakeFailureDisabled=True:', v: 'the bake is never marked Failed.', state: 'gray' },
      ] }),
    ].join('')
  },
  narrow: {
    w: 318, h: 404, body: [
      plate({ x: 24, y: 0, w: 150, kind: 'n', chip: { text: 'Deploying', state: 'blue' }, sub: 'waits for health' }),
      edge([[99, 56], [99, 101]]),
      text({ x: 107, y: 76, t: ['HealthChecks', 'Healthy'] }),
      plate({ x: 24, y: 104, w: 150, kind: 'n', chip: { text: 'InProgress', state: 'yellow' }, sub: 'bakeTime runs' }),
      edge([[99, 160], [99, 205]]),
      text({ x: 107, y: 188, t: 'bakeTime passed' }),
      plate({ x: 24, y: 208, w: 150, kind: 'n', chip: { text: 'Succeeded', state: 'green' }, sub: 'next version may go' }),
      plate({ x: 210, y: 104, w: 108, kind: 'n', chip: { text: 'Failed', state: 'red' }, sub: ['automatic', 'deploys stop'] }),
      edge([[174, 132], [207, 132]]),
      text({ x: 191, y: 124, t: 'error', anchor: 'middle' }),
      edge([[174, 28], [264, 28], [264, 101]]),
      text({ x: 182, y: 20, t: 'deployTimeout' }),
      edge([[264, 176], [264, 300], [8, 300], [8, 28], [21, 28]], { dashed: true }),
      text({ x: 20, y: 292, t: 'rollout.kuberik.com/retry', role: 'mono' }),
      notes({ x: 0, y: 324, w: 318, items: [
        { k: 'error:', v: 'a HealthCheck errors after the deploy.', state: 'red' },
        { k: 'Cancelled:', v: 'a deploy by hand replaces the bake.', state: 'gray' },
        { k: 'BakeFailureDisabled=True:', v: 'never Failed.', state: 'gray' },
      ] }),
    ].join('')
  }
};

// ============ propagation: two Rollouts, two handles on Flux ============
figs.propagation = {
  title: 'Two Rollouts drive one service: one moves the manifests tag, one sets the app version',
  desc: 'A Rollout over the manifests artifact moves the tag of a Flux OCIRepository. A second Rollout over the application image sets a version substitute on the Flux Kustomization. The OCIRepository feeds the Kustomization, which applies the workload.',
  wide: {
    w: 632, h: 232, body: [
      group({ x: 0, y: 0, w: 196, h: 232, label: 'Kuberik', kind: 'k' }),
      plate({ x: 12, y: 36, w: 172, kind: 'k', key: true, title: 'Rollout', sub: 'over the manifests' }),
      plate({ x: 12, y: 156, w: 172, kind: 'k', key: true, title: 'Rollout', sub: 'over the app image' }),
      group({ x: 296, y: 0, w: 172, h: 232, label: 'Flux', kind: 'f' }),
      plate({ x: 308, y: 36, w: 148, kind: 'f', title: 'OCIRepository', sub: 'fetches manifests' }),
      plate({ x: 308, y: 156, w: 148, kind: 'f', title: 'Kustomization', sub: 'applies them' }),
      edge([[184, 64], [305, 64]], { kind: 'act', label: { x: 240, y: 56, t: 'moves tag', anchor: 'middle' } }),
      edge([[184, 184], [305, 184]], { kind: 'act', label: { x: 240, y: 176, t: 'sets version', anchor: 'middle' } }),
      edge([[382, 92], [382, 153]]),
      plate({ x: 516, y: 164, w: 116, kind: 'n', title: 'Workload' }),
      edge([[456, 184], [513, 184]]),
    ].join('')
  },
  narrow: {
    w: 318, h: 334, body: [
      group({ x: 0, y: 0, w: 318, h: 104, label: 'Kuberik', kind: 'k' }),
      plate({ x: 12, y: 36, w: 136, kind: 'k', key: true, title: 'Rollout', sub: 'over manifests' }),
      plate({ x: 170, y: 36, w: 136, kind: 'k', key: true, title: 'Rollout', sub: 'over app image' }),
      edge([[80, 92], [80, 177]], { kind: 'act', label: { x: 88, y: 132, t: 'moves tag' } }),
      edge([[238, 92], [238, 177]], { kind: 'act', label: { x: 246, y: 132, t: ['sets', 'version'] } }),
      group({ x: 0, y: 148, w: 318, h: 104, label: 'Flux', kind: 'f' }),
      plate({ x: 12, y: 180, w: 136, kind: 'f', title: 'OCIRepository', sub: 'fetches manifests' }),
      plate({ x: 170, y: 180, w: 136, kind: 'f', title: 'Kustomization', sub: 'applies them' }),
      edge([[148, 208], [167, 208]]),
      plate({ x: 170, y: 286, w: 136, kind: 'n', title: 'Workload' }),
      edge([[238, 236], [238, 283]]),
    ].join('')
  }
};

// ============ env-tiers-github: promotion across clusters through GitHub deployments ============
const ghName = 'kuberik/hello-world/staging';
figs['env-tiers-github'] = {
  title: 'Two clusters that never connect: Environments promote through GitHub deployments',
  desc: 'The staging cluster runs a Rollout and an Environment with tier staging; the Environment reports each deploy and its bake to the GitHub deployment kuberik/hello-world/staging, status success. The production cluster runs an Environment with tier production that reads that upstream status and sets allowedVersions on its RolloutGate ghd-…; the production Rollout deploys only what the gate allows.',
  // Lines never cross a region header: the reports line rises right of the staging header, the reads line drops
  // right of the production header (R3-A-6). The status chip sits on the deployment name's row, after it.
  wide: {
    w: 632, h: 404, body: [
      plate({ x: 146, y: 10, w: 340, h: 56, kind: 'f', title: 'GitHub deployment', sub: [ghName], mono: true }),
      chipSvg({ x: 472, cy: 48, text: 'success', state: 'green', anchor: 'end' }),
      group({ x: 0, y: 120, w: 250, h: 196, chip: { text: 'staging', state: 'violet' }, label: 'cluster', kind: 'n' }),
      plate({ x: 12, y: 160, w: 226, kind: 'k', key: true, title: 'Environment', sub: 'environment: staging', mono: true }),
      plate({ x: 12, y: 248, w: 226, kind: 'k', title: 'Rollout', sub: 'deploys and bakes' }),
      edge([[107, 248], [107, 219]]),
      edge([[196, 160], [196, 69]], { kind: 'act', label: { x: 204, y: 98, t: 'reports deploy + bake' } }),
      group({ x: 382, y: 120, w: 250, h: 284, chip: { text: 'production', state: 'prod' }, label: 'cluster', kind: 'n' }),
      edge([[486, 38], [600, 38], [600, 157]], { label: { x: 592, y: 98, t: 'reads upstream', anchor: 'end' } }),
      plate({ x: 394, y: 160, w: 226, kind: 'k', key: true, title: 'Environment', sub: 'environment: production', mono: true }),
      edge([[440, 216], [440, 245]], { kind: 'act', label: { x: 448, y: 236, t: 'sets allowedVersions' } }),
      plate({ x: 394, y: 248, w: 226, kind: 'k', title: 'RolloutGate', sub: 'ghd-…  allowedVersions', mono: true }),
      edge([[440, 304], [440, 333]]),
      plate({ x: 394, y: 336, w: 226, kind: 'k', title: 'Rollout', sub: 'deploys only what it allows' }),
    ].join('')
  },
  narrow: {
    w: 318, h: 480, body: [
      group({ x: 0, y: 0, w: 318, h: 124, chip: { text: 'staging', state: 'violet' }, label: 'cluster', kind: 'n' }),
      plate({ x: 12, y: 40, w: 124, kind: 'k', title: 'Rollout', sub: 'deploys, bakes' }),
      plate({ x: 150, y: 40, w: 156, h: 72, kind: 'k', key: true, title: 'Environment', sub: ['`environment:`', '`staging`'] }),
      edge([[136, 68], [147, 68]]),
      edge([[228, 112], [228, 157]], { kind: 'act', label: { x: 220, y: 146, t: 'reports deploy + bake', anchor: 'end' } }),
      plate({ x: 0, y: 160, w: 318, h: 64, kind: 'f', title: 'GitHub deployment', sub: [ghName], mono: true, subTop: 48 }),
      chipSvg({ x: 306, cy: 180, text: 'success', state: 'green', anchor: 'end' }),
      edge([[290, 224], [290, 297]], { label: { x: 282, y: 246, t: 'reads upstream', anchor: 'end' } }),
      group({ x: 0, y: 260, w: 318, h: 220, chip: { text: 'production', state: 'prod' }, label: 'cluster', kind: 'n' }),
      plate({ x: 12, y: 300, w: 294, kind: 'k', key: true, title: 'Environment', sub: '`environment: production`' }),
      edge([[90, 356], [90, 409]], { kind: 'act', label: { x: 98, y: 388, t: 'sets allowedVersions' } }),
      plate({ x: 12, y: 412, w: 156, kind: 'k', title: 'RolloutGate', sub: 'allowedVersions', mono: true }),
      plate({ x: 192, y: 412, w: 114, kind: 'k', title: 'Rollout', sub: 'deploys it' }),
      edge([[168, 440], [189, 440]]),
    ].join('')
  }
};

// ============ flux-propagation: where Kuberik and Flux meet (integrations/fluxcd) ============
figs['flux-propagation'] = {
  title: 'The Rollout picks a release from the ReleaseSource and writes it into Flux; the Kustomization\'s health comes back as a HealthCheck',
  desc: 'A registry feeds Kuberik\'s ReleaseSource, which the Rollout reads through spec.releaseSourceRef, and Flux\'s OCIRepository, which fetches the artifact. The Rollout writes spec.ref.tag on an OCIRepository annotated rollout.kuberik.com/rollout, or spec.postBuild.substitute on a Kustomization annotated rollout.kuberik.com/substitute.<VAR>.from. The OCIRepository feeds the Kustomization, which applies the workload; a HealthCheck of class kustomization watches the Kustomization and the Rollout reads its health.',
  wide: {
    w: 632, h: 292, body: [
      plate({ x: 0, y: 0, w: 130, kind: 'n', title: 'Registry', sub: 'OCI tags' }),
      plate({ x: 170, y: 0, w: 150, kind: 'k', title: 'ReleaseSource', sub: '`spec.oci`' }),
      plate({ x: 360, y: 0, w: 130, kind: 'k', key: true, title: 'Rollout', sub: 'picks a release' }),
      edge([[130, 28], [167, 28]]), edge([[320, 28], [357, 28]]),
      plate({ x: 502, y: 96, w: 130, kind: 'k', title: 'HealthCheck', sub: '`kustomization`' }),
      edge([[567, 96], [567, 28], [493, 28]], { label: { x: 575, y: 66, t: 'health' } }),
      plate({ x: 0, y: 200, w: 240, h: 72, kind: 'f', title: 'OCIRepository', sub: ['fetches the artifact', '`rollout.kuberik.com/rollout`'] }),
      plate({ x: 258, y: 200, w: 214, h: 88, kind: 'f', title: 'Kustomization', sub: ['applies it', '`rollout.kuberik.com/`', '`substitute.<VAR>.from`'] }),
      plate({ x: 502, y: 216, w: 130, kind: 'n', title: 'Workload' }),
      edge([[65, 56], [65, 197]]),
      edge([[380, 56], [380, 150], [150, 150], [150, 197]], { kind: 'act', label: { x: 265, y: 142, t: 'spec.ref.tag', anchor: 'middle', role: 'mono' } }),
      edge([[446, 56], [446, 197]], { kind: 'act', label: { x: 438, y: 180, t: 'spec.postBuild.substitute', anchor: 'end', role: 'mono' } }),
      edge([[240, 236], [255, 236]]),
      edge([[472, 236], [499, 236]]),
      edge([[462, 200], [462, 124], [499, 124]]),
    ].join('')
  },
  narrow: {
    w: 318, h: 504, body: [
      plate({ x: 0, y: 0, w: 130, kind: 'n', title: 'Registry', sub: 'OCI tags' }),
      plate({ x: 170, y: 0, w: 148, kind: 'k', title: 'ReleaseSource', sub: '`spec.oci`' }),
      edge([[130, 28], [167, 28]]),
      plate({ x: 0, y: 96, w: 130, kind: 'k', title: 'HealthCheck', sub: '`kustomization`' }),
      plate({ x: 170, y: 96, w: 148, kind: 'k', key: true, title: 'Rollout', sub: 'picks a release' }),
      edge([[244, 56], [244, 93]]),
      edge([[130, 124], [167, 124]]),
      edge([[110, 56], [110, 72], [150, 72], [150, 209]]),
      edge([[192, 152], [192, 209]], { kind: 'act', label: { x: 200, y: 186, t: 'spec.ref.tag', role: 'mono' } }),
      plate({ x: 16, y: 212, w: 264, h: 72, kind: 'f', title: 'OCIRepository', sub: ['fetches the artifact', '`rollout.kuberik.com/rollout`'] }),
      edge([[306, 152], [306, 327]], { kind: 'act' }),
      text({ x: 298, y: 316, t: 'spec.postBuild.substitute', role: 'mono', anchor: 'end' }),
      edge([[60, 284], [60, 327]]),
      plate({ x: 16, y: 330, w: 302, h: 88, kind: 'f', title: 'Kustomization', sub: ['applies it', '`rollout.kuberik.com/`', '`substitute.<VAR>.from`'] }),
      edge([[16, 374], [6, 374], [6, 172], [65, 172], [65, 155]]),
      plate({ x: 16, y: 448, w: 140, kind: 'n', title: 'Workload' }),
      edge([[86, 418], [86, 445]]),
    ].join('')
  }
};

// ============ datadog-health-paths: two ways Datadog state reaches a Rollout (integrations/datadog) ============
const hcChips = (x, cy) => chipSvg({ x, cy, text: 'Healthy', state: 'green', anchor: 'start' }) +
  chipSvg({ x: x + chipW('Healthy') + 8, cy, text: 'Unhealthy', state: 'red', anchor: 'start' }) +
  chipSvg({ x: x + chipW('Healthy') + chipW('Unhealthy') + 16, cy, text: 'Pending', state: 'amber', anchor: 'start' });
figs['datadog-health-paths'] = {
  title: 'datadog-controller turns monitors and incidents into HealthChecks; the Rollout reads only the HealthChecks',
  desc: 'Two paths. Through the API: datadog-controller reads Datadog monitors and incidents with DD_API_KEY and DD_APP_KEY and writes HealthChecks of class datadog or datadog-incidents. Through the Datadog Operator: a DatadogMonitor resource synced by the operator and annotated kuberik.com/health-check: "true" makes datadog-controller write a HealthCheck datadog-check-<name> of class datadog-monitor-crd. The Rollout selects both with healthCheckSelector. A HealthCheck is Healthy, Unhealthy or Pending.',
  wide: {
    w: 632, h: 290, body: [
      plate({ x: 0, y: 96, w: 120, h: 72, kind: 'f', title: 'Datadog', sub: ['monitors,', 'incidents'] }),
      plate({ x: 152, y: 24, w: 150, kind: 'k', title: 'datadog-controller', sub: 'polls every 60s' }),
      plate({ x: 152, y: 168, w: 150, h: 72, kind: 'f', title: 'DatadogMonitor', sub: ['synced by the', 'Datadog Operator'] }),
      edge([[120, 116], [136, 116], [136, 52], [149, 52]]),
      text({ x: 136, y: 40, t: 'API', anchor: 'middle' }),
      edge([[120, 148], [136, 148], [136, 196], [149, 196]]),
      edge([[227, 168], [227, 83]]),
      plate({ x: 326, y: 24, w: 186, h: 72, kind: 'k', title: 'HealthCheck', sub: ['`datadog`', '`datadog-incidents`'] }),
      plate({ x: 326, y: 168, w: 186, h: 72, kind: 'k', title: 'HealthCheck', sub: ['`datadog-check-<name>`', '`datadog-monitor-crd`'] }),
      edge([[302, 52], [323, 52]], { kind: 'act' }),
      edge([[302, 72], [314, 72], [314, 196], [323, 196]], { kind: 'act' }),
      plate({ x: 536, y: 112, w: 96, kind: 'k', key: true, title: 'Rollout', sub: 'reads both' }),
      edge([[512, 60], [522, 60], [522, 128], [533, 128]]),
      edge([[512, 204], [522, 204], [522, 152], [533, 152]]),
      text({ x: 540, y: 192, t: ['healthCheck', 'Selector'], role: 'mono' }),
      text({ x: 0, y: 280, t: 'HealthCheck status' }),
      hcChips(124, 276),
    ].join('')
  },
  narrow: {
    w: 318, h: 486, body: [
      plate({ x: 0, y: 0, w: 318, kind: 'f', title: 'Datadog', sub: 'monitors, incidents' }),
      edge([[68, 56], [68, 85]], { label: { x: 76, y: 76, t: 'API' } }),
      edge([[250, 56], [250, 85]]),
      plate({ x: 0, y: 88, w: 140, kind: 'k', title: 'datadog-controller', sub: 'polls every 60s' }),
      plate({ x: 168, y: 88, w: 150, kind: 'f', title: 'DatadogMonitor', sub: 'Datadog Operator' }),
      edge([[168, 116], [143, 116]]),
      edge([[60, 144], [60, 181]], { kind: 'act' }),
      plate({ x: 16, y: 184, w: 286, kind: 'k', title: 'HealthCheck', sub: '`datadog, datadog-incidents`' }),
      edge([[8, 144], [8, 292], [13, 292]], { kind: 'act' }),
      plate({ x: 16, y: 264, w: 286, h: 72, kind: 'k', title: 'HealthCheck', sub: ['`datadog-check-<name>`', '`datadog-monitor-crd`'] }),
      edge([[160, 336], [160, 377]]),
      edge([[302, 212], [312, 212], [312, 408], [299, 408]]),
      plate({ x: 16, y: 380, w: 280, kind: 'k', key: true, title: 'Rollout', sub: '`healthCheckSelector`' }),
      hcChips(16, 466),
    ].join('')
  }
};

// ============ release-stages: one release, left to right (what-is-kuberik) ============
const eyebrow = (x, y, t) => `<text class="df-glabel" x="${x}" y="${y}">${esc(t)}</text>`;
figs['release-stages'] = {
  title: 'One release from tag to record: detect, gate, deploy, verify, record',
  desc: 'Your CI pushes a tag to a registry. Kuberik detects it with a ReleaseSource, checks it against the RolloutGates (the Rollout reports GatesPassing), and the Rollout hands it to Flux by setting a Kustomization substitute or an OCIRepository tag. HealthChecks report health while the Rollout bakes the deploy, Deploying then InProgress, and the Rollout records the result in its history as Succeeded or Failed. After a Failed bake automatic deploys stop until someone acts.',
  wide: {
    w: 632, h: 236, body: [
      eyebrow(0, 12, 'Your CI'), eyebrow(164, 12, 'Detect'), eyebrow(328, 12, 'Gate'), eyebrow(492, 12, 'Deploy'),
      plate({ x: 0, y: 24, w: 140, kind: 'f', title: 'Registry', sub: 'a new tag' }),
      plate({ x: 164, y: 24, w: 140, kind: 'k', title: 'ReleaseSource', sub: 'lists the tag' }),
      plate({ x: 328, y: 24, w: 140, kind: 'k', title: 'RolloutGate', sub: 'allows versions' }),
      plate({ x: 492, y: 24, w: 140, kind: 'f', title: 'Kustomization', sub: 'or OCIRepository' }),
      edge([[140, 52], [161, 52]]), edge([[304, 52], [325, 52]]), edge([[468, 52], [489, 52]], { kind: 'act' }),
      eyebrow(506, 132, 'Verify'), eyebrow(342, 132, 'Record'),
      edge([[600, 80], [600, 141]]),
      plate({ x: 492, y: 144, w: 140, kind: 'k', title: 'HealthCheck', sub: 'reports health' }),
      plate({ x: 328, y: 144, w: 140, kind: 'k', key: true, title: 'Rollout', sub: 'status.history', mono: true }),
      edge([[492, 172], [471, 172]]),
      edge([[328, 172], [278, 172]]),
      chipSvg({ x: 270, cy: 172, text: 'Failed', state: 'red', anchor: 'end' }),
      text({ x: 180, y: 176, t: 'or', anchor: 'middle' }),
      chipSvg({ x: 168, cy: 172, text: 'Succeeded', state: 'green', anchor: 'end' }),
      text({ x: 120, y: 212, t: ['Failed: automatic deploys stop', 'until someone acts.'] }),
    ].join('')
  },
  narrow: {
    w: 318, h: 560, body: [
      ...[['Your CI', 0], ['Detect', 80], ['Gate', 160], ['Deploy', 240], ['Verify', 320], ['Record', 400]].map(([t, y]) => eyebrow(0, y + 32, t)),
      plate({ x: 84, y: 0, w: 234, kind: 'f', title: 'Registry', sub: 'a new tag' }),
      plate({ x: 84, y: 80, w: 234, kind: 'k', title: 'ReleaseSource', sub: 'lists the tag' }),
      plate({ x: 84, y: 160, w: 234, kind: 'k', title: 'RolloutGate', sub: 'allows versions' }),
      plate({ x: 84, y: 240, w: 234, kind: 'f', title: 'Kustomization', sub: 'or OCIRepository' }),
      plate({ x: 84, y: 320, w: 234, kind: 'k', title: 'HealthCheck', sub: 'reports health' }),
      plate({ x: 84, y: 400, w: 234, kind: 'k', key: true, title: 'Rollout', sub: 'status.history', mono: true }),
      ...[56, 136, 216, 296, 376].map((y) => edge([[201, y], [201, y + 21]], { kind: y === 216 ? 'act' : 'ink' })),
      edge([[201, 456], [201, 477]]),
      chipSvg({ x: 84, cy: 492, text: 'Succeeded', state: 'green', anchor: 'start' }),
      text({ x: 192, y: 496, t: 'or' }),
      chipSvg({ x: 214, cy: 492, text: 'Failed', state: 'red', anchor: 'start' }),
      text({ x: 84, y: 530, t: ['Failed: automatic deploys stop', 'until someone acts.'] }),
    ].join('')
  }
};

// ============ gate-model: four writers, one RolloutGate kind, one decision (concepts/gates) ============
function stack({ x, y, w, h }) {
  return `<g class="df-plate df-k df-stack"><rect x="${x + 8}" y="${y - 8}" width="${w}" height="${h}" rx="8"/><rect x="${x + 4}" y="${y - 4}" width="${w}" height="${h}" rx="8"/></g>`;
}
const reasonRows = (x, y) => [['AllGatesPassing', 'green'], ['SomeGatesBlocking', 'amber'], ['NoAllowedVersions', 'amber']]
  .map(([t, st], i) => `<circle class="df-dot df-dot-${st}" cx="${x + 4}" cy="${y + i * 20 - 4}" r="3.5"/><text class="df-mono" x="${x + 14}" y="${y + i * 20}">${t}</text>`).join('');
figs['gate-model'] = {
  title: 'Every gate is a RolloutGate; the Rollout deploys only what every gate lets through',
  desc: 'Four writers make RolloutGates: a RolloutSchedule sets passing (schedule-gate-…), an ApprovalPolicy with RolloutApprovals sets allowedVersions (approval-gate-…), a RolloutDependency sets allowedVersions to the releases whose required contract its provider serves (dependency-<name>), and you or an Environment write one directly. The Rollout reads them all and reports the GatesPassing condition: AllGatesPassing, SomeGatesBlocking or NoAllowedVersions. Separately, an Unhealthy HealthCheck holds automatic deploys with DeploymentBlocked=True.',
  // RolloutDependency's line is its Satisfied condition: the provider serves the contract at a version the release
  // requires (rollout-controller rolloutdependency_controller.go:184-206, WaitingForProvider), not an upstream bake.
  wide: {
    w: 632, h: 312, body: [
      plate({ x: 0, y: 0, w: 190, kind: 'k', title: 'RolloutSchedule', sub: ['a time window', '`passing`'] }),
      plate({ x: 0, y: 80, w: 190, kind: 'k', title: 'ApprovalPolicy', sub: ['+ RolloutApproval', '`allowedVersions`'] }),
      plate({ x: 0, y: 160, w: 190, kind: 'k', title: 'RolloutDependency', sub: ['provider serves contract', '`allowedVersions`'] }),
      plate({ x: 0, y: 240, w: 190, kind: 'n', title: 'You or an Environment', sub: ['write one directly', '`either field`'] }),
      edge([[190, 36], [222, 36], [222, 146], [237, 146]]),
      edge([[190, 116], [214, 116], [214, 164], [237, 164]]),
      edge([[190, 196], [206, 196], [206, 182], [237, 182]]),
      edge([[190, 276], [198, 276], [198, 200], [237, 200]]),
      stack({ x: 240, y: 104, w: 188, h: 112 }),
      plate({ x: 240, y: 104, w: 188, h: 112, kind: 'k', title: 'RolloutGate', sub: ['schedule-gate-…', 'approval-gate-…', 'dependency-<name>', 'your name, ghd-…'], mono: true }),
      edge([[436, 160], [469, 160]]),
      plate({ x: 472, y: 132, w: 160, kind: 'k', key: true, title: 'Rollout', sub: 'GatesPassing', mono: true }),
      reasonRows(472, 216),
      plate({ x: 472, y: 0, w: 160, kind: 'k', title: 'HealthCheck', sub: 'Unhealthy', mono: true }),
      edge([[600, 56], [600, 129]], { kind: 'held' }),
      text({ x: 592, y: 92, t: 'DeploymentBlocked=True', role: 'mono', anchor: 'end' }),
    ].join('')
  },
  narrow: {
    w: 318, h: 540, body: [
      plate({ x: 0, y: 0, w: 155, kind: 'k', title: 'RolloutSchedule', sub: ['a time window', '`passing`'] }),
      plate({ x: 163, y: 0, w: 155, kind: 'k', title: 'ApprovalPolicy', sub: ['+ RolloutApproval', '`allowedVersions`'] }),
      plate({ x: 0, y: 80, w: 155, kind: 'k', title: 'RolloutDependency', sub: ['provider serves', 'contract', '`allowedVersions`'] }),
      plate({ x: 163, y: 80, w: 155, h: 88, kind: 'n', title: 'You, Environment', sub: ['write one directly', '`either field`'] }),
      edge([[159, 168], [159, 213]], { label: { x: 167, y: 196, t: 'each writes one' } }),
      stack({ x: 0, y: 224, w: 306, h: 112 }),
      plate({ x: 0, y: 224, w: 306, h: 112, kind: 'k', title: 'RolloutGate', sub: ['schedule-gate-…', 'approval-gate-…', 'dependency-<name>', 'your name, ghd-…'], mono: true }),
      edge([[80, 336], [80, 381]]),
      plate({ x: 0, y: 384, w: 160, kind: 'k', key: true, title: 'Rollout', sub: 'GatesPassing', mono: true }),
      reasonRows(0, 490),
      plate({ x: 186, y: 384, w: 132, kind: 'k', title: 'HealthCheck', sub: 'Unhealthy', mono: true }),
      edge([[186, 412], [163, 412]], { kind: 'held' }),
      text({ x: 318, y: 460, t: 'DeploymentBlocked=True', role: 'mono', anchor: 'end' }),
    ].join('')
  }
};

// ---------- guide-figure parts (R1-DES-7) ----------
// band: a state over time, a 6-unit bar in the state chip's line colour (blue Deploying, yellow InProgress).
const band = ({ x, y, w, h = 6, state }) => `<rect class="df-band df-band-${state}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(3, h / 2)}"/>`;
// dim: a duration, drawn as a dimension line with end ticks (ink-subtle 1 px); horizontal unless v.
const dim = ({ x1, x2, y, v = false }) => v
  ? `<path class="df-dim" d="M${y - 6} ${x1}H${y + 6}M${y} ${x1}V${x2}M${y - 6} ${x2}H${y + 6}"/>`
  : `<path class="df-dim" d="M${x1} ${y - 6}V${y + 6}M${x1} ${y}H${x2}M${x2} ${y - 6}V${y + 6}"/>`;
// guide: a moment, a dashed hairline in --line.
const guide = (x, y1, y2) => `<path class="df-guide" d="M${x} ${y1}V${y2}"/>`;
// meter: a share (traffic weight), one fill on a neutral track (single fill, never two-tone).
const meter = ({ x, y, w, pct }) => `<rect class="df-meter" x="${x}" y="${y}" width="${w}" height="6" rx="3"/>` +
  `<rect class="df-meter-fill" x="${x}" y="${y}" width="${n(w * pct / 100)}" height="6" rx="3"/>`;
const dot = (cx, cy, state, r = 5) => `<circle class="df-dot df-dot-${state}" cx="${cx}" cy="${cy}" r="${r}"/>`;

// ============ health-bake: one deploy's bake on a clock (gates/health-checks) ============
// ROLE: the guide's view of the bake. rollout-bake (concepts/rollouts) is the state machine, every edge; this is
// one deploy against the two durations the guide sets (deployTimeout 15m, bakeTime 10m), so a reader sees which
// clock runs when. Borrows rollout-bake's chips and footnote rule and release-stages' eyebrow row; the time lanes
// are new (no existing figure has a time axis): a 6-unit state band per lane, dimension lines for durations.
const HB = { x0: 104, k: 28 }; const hbx = (m) => HB.x0 + m * HB.k;
figs['health-bake'] = {
  title: 'One deploy on the clock: deployTimeout bounds the wait for health, bakeTime runs from the moment every check is Healthy',
  desc: 'A deploy starts: its bakeStatus is Deploying and every selected HealthCheck is reset to Pending. When every check is Healthy again, here four minutes in, the bake starts and bakeStatus is InProgress. deployTimeout, 15 minutes from the deploy, is the limit for that moment. bakeTime, 10 minutes from the bake start, ends in Succeeded. A check error at any point after the deploy started fails it, before or during the bake; without healthCheckSelector the bake starts at once.',
  wide: {
    w: 632, h: 290, body: [
      text({ x: hbx(0), y: 14, t: 'deploy starts' }),
      text({ x: hbx(4), y: 14, t: 'every check Healthy' }),
      text({ x: hbx(14), y: 14, t: 'bakeTime passed', anchor: 'end' }),
      guide(hbx(0), 22, 132), guide(hbx(4), 22, 132), guide(hbx(14), 22, 132),
      text({ x: 0, y: 48, t: 'bakeStatus', role: 'mono' }),
      chipSvg({ x: hbx(0) + 6, cy: 44, text: 'Deploying', state: 'blue', anchor: 'start' }),
      chipSvg({ x: hbx(4) + 6, cy: 44, text: 'InProgress', state: 'yellow', anchor: 'start' }),
      chipSvg({ x: hbx(14) + 6, cy: 44, text: 'Succeeded', state: 'green', anchor: 'start' }),
      band({ x: hbx(0), y: 64, w: hbx(4) - hbx(0), state: 'blue' }),
      band({ x: hbx(4), y: 64, w: hbx(14) - hbx(4), state: 'yellow' }),
      text({ x: 0, y: 112, t: 'HealthChecks' }),
      chipSvg({ x: hbx(0) + 6, cy: 108, text: 'Pending', state: 'gray', anchor: 'start' }),
      chipSvg({ x: hbx(4) + 6, cy: 108, text: 'Healthy', state: 'green', anchor: 'start' }),
      band({ x: hbx(0), y: 127, w: hbx(4) - hbx(0), h: 2, state: 'gray' }),
      band({ x: hbx(4), y: 127, w: hbx(14) - hbx(4), h: 2, state: 'green' }),
      // deployTimeout is the clock until the bake starts (rollout_controller.go:1344-1357: only while BakeStartTime is
      // nil), so its line ends where InProgress begins; bakeTime picks up from that tick to Succeeded.
      text({ x: hbx(0) + 6, y: 156, t: 'deployTimeout: 15m, the limit for the bake to start', role: 'label' }),
      dim({ x1: hbx(0), x2: hbx(4), y: 170 }),
      text({ x: hbx(4) + 6, y: 202, t: 'bakeTime: 10m, no error, then Succeeded', role: 'label' }),
      dim({ x1: hbx(4), x2: hbx(14), y: 216 }),
      notes({ x: 0, y: 238, w: 632, items: [
        { k: 'A check error after the deploy starts:', v: 'Failed, before or during the bake.', state: 'red' },
        { k: 'No healthCheckSelector:', v: 'the bake starts at once.', state: 'gray' },
      ] }),
    ].join('')
  },
  narrow: {
    w: 318, h: 276, body: [
      band({ x: 0, y: 12, w: 6, h: 88, state: 'blue' }),
      band({ x: 0, y: 100, w: 6, h: 160, state: 'yellow' }),
      chipSvg({ x: 20, cy: 12, text: 'Deploying', state: 'blue', anchor: 'start' }),
      text({ x: 130, y: 16, t: 'deploy starts' }),
      text({ x: 20, y: 44, t: 'checks reset to Pending' }),
      chipSvg({ x: 20, cy: 100, text: 'InProgress', state: 'yellow', anchor: 'start' }),
      text({ x: 140, y: 104, t: 'every check Healthy' }),
      chipSvg({ x: 20, cy: 260, text: 'Succeeded', state: 'green', anchor: 'start' }),
      text({ x: 130, y: 264, t: 'bakeTime passed' }),
      // one measure column, two consecutive clocks: deployTimeout until the bake starts, then bakeTime.
      dim({ x1: 12, x2: 100, y: 304, v: true }),
      text({ x: 290, y: 70, t: 'deployTimeout: 15m', anchor: 'end' }),
      dim({ x1: 100, x2: 260, y: 304, v: true }),
      text({ x: 290, y: 184, t: 'bakeTime: 10m', anchor: 'end' }),
      dot(24, 171, 'red', 3.5),
      text({ x: 36, y: 175, t: ['a check error', 'here or before:', 'Failed'] }),
    ].join('')
  }
};

// ============ promote-waves: one release down the tiers, then wave by wave (releases/promote) ============
// ROLE: the guide's view of promotion: which release may go where next. env-tiers-github (concepts/environments)
// shows the mechanism (two clusters, GitHub between); this shows the order the guide configures: staging, then
// production wave 1, then wave 2, for one release. Regions and chips are env-tiers-github's (tier chip + label);
// plates are 172 wide in 196 regions, the architecture figure's column rhythm. A site that has not started is a
// dashed plate (a state, not an object), titled with its WaveReady reason in words.
const pwPlates = (o) => [
  plate({ x: o[0][0], y: o[0][1], w: o[2], kind: 'k', chip: { text: 'Succeeded', state: 'green' }, sub: ['baked 1.4.0', 'GitHub has the result'] }),
  plate({ x: o[1][0], y: o[1][1], w: o[2], kind: 'k', key: true, chip: { text: 'InProgress', state: 'yellow' }, sub: ['`site: eu-west-1`', 'staging baked 1.4.0'] }),
];
figs['promote-waves'] = {
  title: 'One release, in order: staging bakes it, then production wave 1, then wave 2',
  desc: 'Release 1.4.0 has baked in staging (Succeeded) and GitHub has the result. The production Environment of the wave-1 site eu-west-1 allows it because staging baked it, and it is baking there (InProgress). The wave-2 site us-east-1 waits: WaveReady is False until every wave-1 site has baked 1.4.0. With lockstep: true, production stays on one release until every wave baked it.',
  wide: {
    w: 632, h: 214, body: [
      group({ x: 0, y: 0, w: 196, h: 132, chip: { text: 'staging', state: 'violet' }, kind: 'n' }),
      group({ x: 218, y: 0, w: 196, h: 132, chip: { text: 'production', state: 'prod' }, label: 'wave 1', kind: 'n' }),
      group({ x: 436, y: 0, w: 196, h: 132, chip: { text: 'production', state: 'prod' }, label: 'wave 2', kind: 'n' }),
      ...pwPlates([[12, 44], [230, 44], 172]),
      plate({ x: 448, y: 44, w: 172, h: 72, kind: 'n', dashed: true, title: 'Waits for wave 1', sub: ['`site: us-east-1`', '`WaveReady=False`'] }),
      edge([[184, 80], [227, 80]]),
      edge([[402, 80], [445, 80]]),
      notes({ x: 0, y: 156, w: 632, items: [
        { k: 'Wave 1 gets', v: 'what staging baked; wave 2 gets what every wave-1 site baked.', state: 'gray' },
        { k: 'lockstep: true', v: 'keeps production on one release until every wave baked it.', state: 'gray' },
      ] }),
    ].join('')
  },
  narrow: {
    w: 318, h: 496, body: [
      group({ x: 0, y: 0, w: 318, h: 128, chip: { text: 'staging', state: 'violet' }, kind: 'n' }),
      group({ x: 0, y: 156, w: 318, h: 128, chip: { text: 'production', state: 'prod' }, label: 'wave 1', kind: 'n' }),
      group({ x: 0, y: 312, w: 318, h: 128, chip: { text: 'production', state: 'prod' }, label: 'wave 2', kind: 'n' }),
      ...pwPlates([[12, 44], [12, 200], 294]),
      plate({ x: 12, y: 356, w: 294, h: 72, kind: 'n', dashed: true, title: 'Waits for wave 1', sub: ['`site: us-east-1`', '`WaveReady=False`'] }),
      edge([[260, 116], [260, 197]]),
      edge([[260, 272], [260, 353]]),
      notes({ x: 0, y: 464, w: 318, items: [
        { k: 'lockstep: true', v: 'one release in every wave.', state: 'gray' },
      ] }),
    ].join('')
  }
};

// ============ canary-steps: traffic in steps, each held by Kuberik (releases/canary) ============
// ROLE: the guide's flow: OpenKruise moves traffic in steps; openkruise-controller holds each paused step until its
// test passed and its bake time ran, then unpauses it. No existing figure shows a share, so the step plates carry a
// meter (one fill on a neutral track, the dashboard's single-fill bar rule). Plates, wires and the footnote rule are
// the architecture figure's; OpenKruise is an external system, so its steps are lagoon and the controller is mint.
const cvStep = (x, y, w, title, sub, pct) => plate({ x, y, w, h: 100, kind: 'f', title, sub, mono: true }) + meter({ x: x + 14, y: y + 80, w: w - 28, pct });
figs['canary-steps'] = {
  title: 'OpenKruise moves traffic in steps; openkruise-controller unpauses a step once its test passed and its bake time ran',
  desc: 'Step 1 sends 10% of traffic to one canary replica and pauses. openkruise-controller waits until the RolloutTest smoke-test for step 1 Succeeded, then until the step has stayed ready for step-1-bake-time, and unpauses it. Step 2 sends 50% to five replicas. OpenKruise completes the last step without pausing, and the rollout is Healthy with all traffic on the new version. A failed test or a passed ready-timeout leaves the step paused with Stalled=True.',
  wide: {
    w: 632, h: 296, body: [
      cvStep(0, 0, 180, 'Step 1', ['replicas: 1', 'traffic: 10%'], 10),
      cvStep(226, 0, 180, 'Step 2', ['replicas: 5', 'traffic: 50%'], 50),
      cvStep(452, 0, 180, 'After the last step', ['phase: Healthy', 'all traffic'], 100),
      edge([[406, 40], [449, 40]]),
      plate({ x: 40, y: 132, w: 330, h: 72, kind: 'k', key: true, title: 'openkruise-controller', sub: ['RolloutTest smoke-test Succeeded,', 'then ready for step-1-bake-time'] }),
      edge([[90, 100], [90, 129]], { label: { x: 98, y: 120, t: 'paused' } }),
      edge([[316, 132], [316, 103]], { kind: 'act', label: { x: 324, y: 120, t: 'unpauses' } }),
      notes({ x: 0, y: 228, w: 632, items: [
        { k: 'The test fails, or step-1-ready-timeout passes:', v: 'the step stays paused, Stalled=True.', state: 'red' },
        { k: 'The last step:', v: 'OpenKruise completes it without pausing, so its tests never run.', state: 'gray' },
      ] }),
    ].join('')
  },
  narrow: {
    w: 318, h: 416, body: [
      cvStep(0, 0, 150, 'Step 1', ['replicas: 1', 'traffic: 10%'], 10),
      cvStep(168, 0, 150, 'Step 2', ['replicas: 5', 'traffic: 50%'], 50),
      plate({ x: 0, y: 132, w: 290, h: 72, kind: 'k', key: true, title: 'openkruise-controller', sub: ['RolloutTest smoke-test Succeeded,', 'then ready for step-1-bake-time'] }),
      edge([[75, 100], [75, 129]], { label: { x: 83, y: 120, t: 'paused' } }),
      edge([[243, 132], [243, 103]], { kind: 'act', label: { x: 235, y: 120, t: 'unpauses', anchor: 'end' } }),
      edge([[306, 100], [306, 233]]),
      cvStep(0, 236, 318, 'After the last step', ['phase: Healthy', 'all traffic'], 100),
      notes({ x: 0, y: 360, w: 318, items: [
        { k: 'Test fails or times out:', v: 'stays paused.', state: 'red' },
        { k: 'Last step:', v: 'never pauses.', state: 'gray' },
      ] }),
    ].join('')
  }
};

// ============ schedule-week: an Allow window over a week (gates/schedules) ============
// ROLE: the guide's business-hours schedule as a week: when the gate passes, and what happens to a release that
// arrives outside it. New object (no figure has a calendar): one 18-unit track per day, the window in the green
// (allowed) chip colours, the held release an amber dot with a dashed amber wire to where it deploys. Day labels
// and the axis use the kit's label and mono roles; the footnote rule is rollout-gating's.
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
function week({ x0, x1, y0, rowH, pitch, axisY, release }) {
  const hx = (h) => n(x0 + h * (x1 - x0) / 24);
  let s = ['00:00', '09:00', '17:00', '24:00'].map((t, i) => text({ x: hx([0, 9, 17, 24][i]), y: axisY, t, role: 'mono', anchor: ['start', 'middle', 'middle', 'end'][i] })).join('');
  DAYS.forEach((d, i) => {
    const y = y0 + i * pitch;
    s += text({ x: 0, y: y + rowH / 2 + 4.5, t: d });
    s += `<rect class="df-day" x="${x0}" y="${y}" width="${x1 - x0}" height="${rowH}" rx="4"/>`;
    if (i < 5) s += `<rect class="df-win" x="${hx(9)}" y="${y}" width="${n(hx(17) - hx(9))}" height="${rowH}" rx="4"/>`;
  });
  const ty = y0 + pitch + rowH / 2, gy = y0 + pitch + rowH + (pitch - rowH) / 2, wy = y0 + 2 * pitch;
  // R6-DES-5: the held wire ends ON the Wednesday dot: down into the gutter, back to just before 09:00, down into the
  // Wed row and right into the green dot, so the head points at the moment it deploys, not at the window corner.
  const dx = n(hx(9) + 8), dy = wy + rowH / 2;
  s += edge([[hx(19), ty], [hx(19), gy], [n(hx(9) - 16), gy], [n(hx(9) - 16), dy], [n(dx - 7), dy]], { kind: 'held', dashed: true });
  s += dot(hx(19), ty, 'amber') + dot(dx, dy, 'green');
  return s;
}
figs['schedule-week'] = {
  title: 'business-hours over a week: the gate passes inside the window, and a release that arrives outside it waits for the next one',
  desc: 'A RolloutSchedule with action Allow and one rule, 09:00 to 17:00 Monday to Friday in America/New_York, makes its gate pass during those hours only. A release that arrives on Tuesday at 19:00 is held while the gate has passing false, and deploys on Wednesday at 09:00 when the window opens and the gate passes again. Saturday and Sunday have no window.',
  wide: {
    w: 632, h: 302, body: [
      text({ x: 0, y: 14, t: 'action: Allow', role: 'mono' }),
      text({ x: 632, y: 14, t: 'timezone: America/New_York', role: 'mono', anchor: 'end' }),
      week({ x0: 48, x1: 632, y0: 52, rowH: 18, pitch: 26, axisY: 40, release: true }),
      notes({ x: 0, y: 248, w: 632, items: [
        { k: 'Tuesday 19:00, a release arrives:', v: 'held, the schedule gate has passing: false.', state: 'amber' },
        { k: 'Wednesday 09:00:', v: 'the window opens, the gate passes, and the release deploys.', state: 'green' },
      ] }),
    ].join('')
  },
  narrow: {
    w: 318, h: 302, body: [
      text({ x: 0, y: 14, t: 'action: Allow', role: 'mono' }),
      text({ x: 0, y: 32, t: 'timezone: America/New_York', role: 'mono' }),
      week({ x0: 40, x1: 318, y0: 66, rowH: 16, pitch: 24, axisY: 56, release: true }),
      notes({ x: 0, y: 248, w: 318, items: [
        { k: 'Tue 19:00:', v: 'held, passing: false.', state: 'amber' },
        { k: 'Wed 09:00:', v: 'the gate passes, it deploys.', state: 'green' },
      ] }),
    ].join('')
  }
};


for (const [id, f] of Object.entries(figs)) {
  const html = `{{/* GENERATED by scripts/docs-figs.mjs: edit the generator, not this file. */}}\n` +
    svg(id, 'wide', f.wide, f.title, f.desc) + '\n' + svg(id, 'narrow', f.narrow, f.title, f.desc) + '\n';
  writeFileSync(join(outDir, `${id}.html`), html);
  console.log('wrote', id);
}
