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
// title Inter 13/600; sub lines Inter 12 ink-muted (mono: true for field names).
function plate({ x, y, w, h, kind = 'n', title, sub = [], mono = false, key = false, chip, dashed = false }) {
  const subs = Array.isArray(sub) ? sub : [sub];
  const H = h ?? (subs.length ? 40 + subs.length * 16 : 40);
  let s = `<g class="df-plate df-${kind}${key ? ' is-key' : ''}${dashed ? ' is-dashed' : ''}">`;
  s += `<rect x="${x}" y="${y}" width="${w}" height="${H}" rx="8"/>`;
  let ty = subs.length ? y + 24 : y + H / 2 + 4.5;
  if (chip) {
    s += chipSvg({ x: x + 14, cy: subs.length ? y + 22 : y + H / 2, text: chip.text, state: chip.state, anchor: 'start' });
  } else if (title) {
    s += `<text class="df-title" x="${x + 14}" y="${ty}">${esc(title)}</text>`;
  }
  subs.forEach((t, i) => {
    const m = mono || t.startsWith('`');
    s += `<text class="df-sub${m ? ' is-mono' : ''}" x="${x + 14}" y="${y + 42 + i * 16}">${esc(t.replace(/`/g, ''))}</text>`;
  });
  return s + '</g>';
}

// chip: the product chip (20 tall, radius 4, 11/16 600 uppercase .06em). Width from a per-character estimate,
// text centred so an estimate error only changes the padding.
const CHIP_CH = 8.2;
function chipW(text) { return Math.round(text.length * CHIP_CH + 14); }
function chipSvg({ x, cy, text, state = 'gray', anchor = 'middle' }) {
  const w = chipW(text);
  const x0 = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
  return `<g class="df-chip df-chip-${state}"><rect x="${n(x0)}" y="${cy - 10}" width="${w}" height="20" rx="4"/>` +
    `<text x="${n(x0 + w / 2)}" y="${cy + 4}" text-anchor="middle">${esc(text.toUpperCase())}</text></g>`;
}

// pill: a version tag (mono 12, radius 4) – the dashboard's tag token.
function pill({ x, y, text, state = 'gray' }) {
  const w = Math.round(text.length * 7.2 + 16);
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

// text: free label. role: label (Inter 12 ink-muted, haloed so it can sit on a line), mono, note.
function text({ x, y, t, anchor = 'start', role = 'label', lines }) {
  const ls = lines ?? (Array.isArray(t) ? t : [t]);
  return ls.map((l, i) => `<text class="df-${role}" x="${x}" y="${y + i * 16}"${anchor !== 'start' ? ` text-anchor="${anchor}"` : ''}>${esc(l)}</text>`).join('');
}

// group: a region (a cluster, or who owns the objects). Dashed 1px line, radius 12, label 12/600 uppercase .06em
// in the owner's ink (mint Kuberik, lagoon Flux, ink-subtle otherwise), or an environment chip.
function group({ x, y, w, h, label, kind = 'n', chip }) {
  let s = `<g class="df-group df-g-${kind}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12"/>`;
  if (chip) s += chipSvg({ x: x + 12, cy: y + 18, text: chip.text, state: chip.state, anchor: 'start' });
  if (label) s += `<text class="df-glabel" x="${chip ? x + 20 + chipW(chip.text) : x + 14}" y="${y + 22}">${esc(label)}</text>`;
  return s + '</g>';
}

// note: a footnote row under a hairline: a small dot in a state colour, then 12/16 ink-muted text.
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
      group({ x: 472, y: 0, w: 160, h: 240, label: 'Flux', kind: 'f' }),
      plate({ x: 12, y: 36, w: 140, kind: 'k', title: 'ReleaseSource', sub: 'lists release tags' }),
      plate({ x: 12, y: 104, w: 140, kind: 'k', title: 'RolloutGate', sub: 'allows versions' }),
      plate({ x: 12, y: 172, w: 140, kind: 'k', title: 'HealthCheck', sub: 'reports health' }),
      plate({ x: 192, y: 104, w: 140, kind: 'k', key: true, title: 'Rollout', sub: 'picks the version' }),
      edge([[152, 64], [172, 64], [172, 118], [189, 118]]),
      edge([[152, 132], [189, 132]]),
      edge([[152, 200], [172, 200], [172, 146], [189, 146]]),
      plate({ x: 484, y: 36, w: 136, kind: 'f', title: 'OCIRepository', sub: 'fetches the artifact' }),
      plate({ x: 484, y: 172, w: 136, kind: 'f', title: 'Kustomization', sub: 'applies manifests' }),
      edge([[552, 92], [552, 169]]),
      edge([[332, 122], [366, 122], [366, 64], [481, 64]], { kind: 'act', label: { x: 424, y: 56, t: 'moves tag', anchor: 'middle' } }),
      edge([[332, 142], [366, 142], [366, 200], [481, 200]], { kind: 'act', label: { x: 424, y: 192, t: 'sets version', anchor: 'middle' } }),
      plate({ x: 484, y: 272, w: 136, kind: 'n', title: 'Workload' }),
      edge([[552, 228], [552, 269]]),
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
      plate({ x: 12, y: 276, w: 136, kind: 'f', title: 'OCIRepository', sub: 'fetches the artifact' }),
      plate({ x: 170, y: 276, w: 136, kind: 'f', title: 'Kustomization', sub: 'applies manifests' }),
      edge([[148, 304], [167, 304]]),
      plate({ x: 170, y: 370, w: 136, kind: 'n', title: 'Workload' }),
      edge([[238, 332], [238, 367]]),
    ].join('')
  }
};

// ============ rollout-gating: gates filter the candidates, the newest allowed one deploys ============
const gatingNotes = [
  { k: 'First deploy:', v: 'gates are skipped.', state: 'gray' },
  { k: 'Deploy by hand (wantedVersion, force-deploy):', v: 'gates are skipped.', state: 'gray' },
  { k: 'A HealthCheck is Unhealthy:', v: 'held, DeploymentBlocked=True.', state: 'amber' },
];
figs['rollout-gating'] = {
  title: 'RolloutGates filter the release candidates; the newest allowed version deploys',
  desc: 'Three release candidates, v1.6.0, v1.5.0 and v1.4.0, reach the RolloutGates. A gate whose allowedVersions lists only v1.5.0 and v1.4.0 holds v1.6.0. The newest allowed candidate, v1.5.0, deploys. When no candidate is allowed, or a gate has passing: false, the Rollout is held and re-evaluated when a gate changes; there is no polling and no reject state. Notes: on the first deploy and on a deploy by hand gates are skipped; an Unhealthy HealthCheck also holds automatic deploys and sets DeploymentBlocked=True.',
  wide: {
    w: 632, h: 330, body: [
      text({ x: 0, y: 14, t: 'RELEASE CANDIDATES', role: 'glabel' }),
      pill({ x: 0, y: 32, text: 'v1.6.0' }),
      pill({ x: 0, y: 76, text: 'v1.5.0' }),
      pill({ x: 0, y: 120, text: 'v1.4.0' }),
      edge([[64, 43], [176, 43]], { kind: 'held', head: false }),
      `<path class="df-stop" d="M176 36v14"/>`,
      edge([[64, 87], [181, 87]], { kind: 'pass' }),
      edge([[64, 131], [181, 131]], { kind: 'pass' }),
      plate({ x: 184, y: 24, w: 188, h: 136, kind: 'k', title: 'RolloutGate', sub: ['passing: true', 'allowedVersions:', '- v1.5.0', '- v1.4.0'], mono: true }),
      edge([[372, 87], [424, 87]], { kind: 'pass' }),
      plate({ x: 428, y: 52, w: 204, kind: 'k', key: true, title: 'Rollout', sub: ['deploys v1.5.0,', 'the newest allowed'] }),
      plate({ x: 428, y: 152, w: 204, kind: 'n', dashed: true, chip: { text: 'Held', state: 'amber' }, sub: ['evaluated again when', 'a gate changes'] }),
      edge([[278, 160], [278, 180], [425, 180]], { kind: 'held', dashed: true }),
      text({ x: 268, y: 186, t: ['otherwise: no candidate', 'allowed, or passing: false'], role: 'label', anchor: 'end' }),
      notes({ x: 0, y: 250, w: 632, items: gatingNotes }),
    ].join('')
  },
  narrow: {
    w: 318, h: 414, body: [
      text({ x: 0, y: 14, t: 'RELEASE CANDIDATES', role: 'glabel' }),
      pill({ x: 0, y: 26, text: 'v1.6.0' }),
      pill({ x: 104, y: 26, text: 'v1.5.0' }),
      pill({ x: 208, y: 26, text: 'v1.4.0' }),
      edge([[32, 48], [32, 76]], { kind: 'held', head: false }),
      `<path class="df-stop" d="M25 76h14"/>`,
      edge([[136, 48], [136, 79]], { kind: 'pass' }),
      edge([[240, 48], [240, 79]], { kind: 'pass' }),
      plate({ x: 0, y: 82, w: 318, h: 88, kind: 'k', title: 'RolloutGate', sub: ['passing: true', 'allowedVersions: [v1.5.0, v1.4.0]'], mono: true }),
      edge([[80, 170], [80, 205]], { kind: 'pass' }),
      edge([[238, 170], [238, 205]], { kind: 'held' }),
      plate({ x: 0, y: 208, w: 152, kind: 'k', key: true, title: 'Rollout', sub: ['deploys v1.5.0,', 'newest allowed'] }),
      plate({ x: 166, y: 208, w: 152, kind: 'n', dashed: true, chip: { text: 'Held', state: 'amber' }, sub: ['nothing allowed;', 'evaluated again', 'on any change'] }),
      notes({ x: 0, y: 316, w: 318, items: [
        { k: 'First deploy:', v: 'gates skipped.', state: 'gray' },
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
  desc: 'A deploy starts in Deploying. When every selected HealthCheck is Healthy after the deploy it moves to InProgress and the bake time runs. When bakeTime passes without an error it is Succeeded. A HealthCheck error after the deploy fails it from Deploying or InProgress, and so does deployTimeout passing before the bake starts. A Failed bake goes back to Deploying with the rollout.kuberik.com/retry annotation. A new deploy cancels a Deploying or InProgress bake, and BakeFailureDisabled=True suppresses failing.',
  wide: {
    w: 632, h: 336, body: [
      plate({ x: 0, y: 0, w: 156, kind: 'n', chip: { text: 'Deploying', state: 'blue' }, sub: 'waits for health' }),
      plate({ x: 238, y: 0, w: 156, kind: 'n', chip: { text: 'InProgress', state: 'yellow' }, sub: 'bakeTime runs' }),
      plate({ x: 476, y: 0, w: 156, kind: 'n', chip: { text: 'Succeeded', state: 'green' }, sub: 'next version may go' }),
      edge([[156, 36], [235, 36]], { kind: 'ink' }),
      text({ x: 197, y: 14, t: ['HealthChecks', 'Healthy'], anchor: 'middle' }),
      edge([[394, 36], [473, 36]], { kind: 'ink' }),
      text({ x: 435, y: 14, t: ['bakeTime', 'passed'], anchor: 'middle' }),
      plate({ x: 238, y: 148, w: 156, kind: 'n', chip: { text: 'Failed', state: 'red' }, sub: ['automatic deploys', 'stop here'] }),
      edge([[316, 56], [316, 145]], { kind: 'ink' }),
      text({ x: 324, y: 96, t: ['a HealthCheck', 'errors'] }),
      edge([[120, 56], [120, 168], [235, 168]], { kind: 'ink' }),
      text({ x: 128, y: 160, t: 'deployTimeout' }),
      edge([[238, 196], [48, 196], [48, 59]], { kind: 'ink', dashed: true }),
      text({ x: 56, y: 216, t: 'rollout.kuberik.com/retry', role: 'mono' }),
      notes({ x: 0, y: 252, w: 632, items: [
        { k: 'Cancelled:', v: 'a new deploy replaces a Deploying or InProgress bake.', state: 'gray' },
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
        { k: 'Cancelled:', v: 'a new deploy replaces the bake.', state: 'gray' },
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
  wide: {
    w: 632, h: 404, body: [
      plate({ x: 196, y: 10, w: 240, h: 56, kind: 'f', title: 'GitHub deployment', sub: [ghName], mono: true }),
      chipSvg({ x: 422, cy: 30, text: 'success', state: 'green', anchor: 'end' }),
      group({ x: 0, y: 120, w: 250, h: 196, chip: { text: 'staging', state: 'violet' }, label: 'cluster', kind: 'n' }),
      plate({ x: 12, y: 160, w: 190, kind: 'k', key: true, title: 'Environment', sub: 'environment: staging', mono: true }),
      plate({ x: 12, y: 248, w: 190, kind: 'k', title: 'Rollout', sub: 'deploys and bakes' }),
      edge([[107, 248], [107, 219]]),
      edge([[60, 160], [60, 48], [193, 48]], { kind: 'act', label: { x: 68, y: 100, t: ['reports deploy', '+ bake'] } }),
      group({ x: 382, y: 120, w: 250, h: 284, chip: { text: 'production', state: 'prod' }, label: 'cluster', kind: 'n' }),
      edge([[436, 38], [572, 38], [572, 157]], { label: { x: 564, y: 100, t: 'reads upstream', anchor: 'end' } }),
      plate({ x: 394, y: 160, w: 226, kind: 'k', key: true, title: 'Environment', sub: 'environment: production', mono: true }),
      edge([[440, 216], [440, 245]], { kind: 'act', label: { x: 448, y: 236, t: 'sets allowedVersions' } }),
      plate({ x: 394, y: 248, w: 226, kind: 'k', title: 'RolloutGate', sub: 'ghd-…  allowedVersions', mono: true }),
      edge([[440, 304], [440, 333]]),
      plate({ x: 394, y: 336, w: 226, kind: 'k', title: 'Rollout', sub: 'deploys only what it allows' }),
    ].join('')
  },
  narrow: {
    w: 318, h: 500, body: [
      group({ x: 0, y: 0, w: 318, h: 112, chip: { text: 'staging', state: 'violet' }, label: 'cluster', kind: 'n' }),
      plate({ x: 12, y: 40, w: 110, kind: 'k', title: 'Rollout', sub: 'deploys, bakes' }),
      plate({ x: 140, y: 40, w: 166, kind: 'k', key: true, title: 'Environment', sub: 'tier: staging' }),
      edge([[122, 68], [137, 68]]),
      edge([[223, 96], [223, 149]], { kind: 'act', label: { x: 231, y: 128, t: ['reports', 'deploy + bake'] } }),
      plate({ x: 0, y: 152, w: 318, h: 56, kind: 'f', title: 'GitHub deployment', sub: [ghName], mono: true }),
      chipSvg({ x: 304, cy: 20 + 152 - 0, text: 'success', state: 'green', anchor: 'end' }),
      edge([[159, 208], [159, 297]], { label: { x: 167, y: 236, t: 'reads upstream' } }),
      group({ x: 0, y: 256, w: 318, h: 244, chip: { text: 'production', state: 'prod' }, label: 'cluster', kind: 'n' }),
      plate({ x: 48, y: 300, w: 222, kind: 'k', key: true, title: 'Environment', sub: 'tier: production' }),
      edge([[110, 356], [110, 413]], { kind: 'act', label: { x: 118, y: 390, t: 'sets allowedVersions' } }),
      plate({ x: 12, y: 416, w: 156, kind: 'k', title: 'RolloutGate', sub: 'allowedVersions', mono: true }),
      plate({ x: 192, y: 416, w: 114, kind: 'k', title: 'Rollout', sub: 'deploys it' }),
      edge([[168, 444], [189, 444]]),
    ].join('')
  }
};

// ============ fluxcd: where Kuberik and Flux meet ============
figs.fluxcd = {
  title: 'Kuberik and Flux: Kuberik lists the tags and picks one, Flux fetches and applies it, a HealthCheck reports back',
  desc: 'An OCI registry feeds two readers: Kuberik\'s ReleaseSource lists its tags and Flux\'s OCIRepository fetches the artifact. The Rollout reads the ReleaseSource, then moves the OCIRepository tag or sets a version on the Kustomization. The Kustomization applies the manifests; a HealthCheck of class kustomization watches it and reports health back to the Rollout.',
  wide: {
    w: 632, h: 268, body: [
      plate({ x: 0, y: 96, w: 120, kind: 'n', title: 'Registry', sub: 'OCI tags' }),
      plate({ x: 168, y: 0, w: 148, kind: 'k', title: 'ReleaseSource', sub: 'lists the tags' }),
      plate({ x: 168, y: 192, w: 148, kind: 'f', title: 'OCIRepository', sub: 'fetches artifact' }),
      edge([[60, 96], [60, 28], [165, 28]]),
      edge([[60, 152], [60, 220], [165, 220]]),
      plate({ x: 364, y: 0, w: 120, kind: 'k', key: true, title: 'Rollout', sub: 'picks one' }),
      edge([[316, 28], [361, 28]]),
      plate({ x: 364, y: 192, w: 120, kind: 'f', title: 'Kustomization', sub: 'applies it' }),
      edge([[316, 220], [361, 220]]),
      edge([[392, 56], [392, 96], [242, 96], [242, 189]], { kind: 'act', label: { x: 250, y: 132, t: 'moves tag' } }),
      edge([[440, 56], [440, 189]], { kind: 'act', label: { x: 432, y: 132, t: ['sets', 'version'], anchor: 'end' } }),
      plate({ x: 516, y: 96, w: 116, kind: 'k', title: 'HealthCheck', sub: 'kustomization', mono: true }),
      edge([[484, 228], [574, 228], [574, 155]], { label: { x: 582, y: 196, t: 'watches' } }),
      edge([[574, 96], [574, 28], [487, 28]], { label: { x: 582, y: 64, t: 'health' } }),
    ].join('')
  },
  narrow: {
    w: 318, h: 446, body: [
      plate({ x: 99, y: 0, w: 120, kind: 'n', title: 'Registry', sub: 'OCI tags' }),
      edge([[130, 56], [130, 72], [74, 72], [74, 105]]),
      edge([[188, 56], [188, 72], [244, 72], [244, 249]]),
      plate({ x: 0, y: 108, w: 148, kind: 'k', title: 'ReleaseSource', sub: 'lists the tags' }),
      edge([[74, 164], [74, 193]]),
      plate({ x: 0, y: 196, w: 148, kind: 'k', key: true, title: 'Rollout', sub: 'picks one' }),
      plate({ x: 170, y: 252, w: 148, kind: 'f', title: 'OCIRepository', sub: 'fetches artifact' }),
      edge([[148, 224], [208, 224], [208, 249]], { kind: 'act', label: { x: 156, y: 216, t: 'moves tag' } }),
      plate({ x: 170, y: 340, w: 148, kind: 'f', title: 'Kustomization', sub: 'applies it' }),
      edge([[244, 308], [244, 337]]),
      plate({ x: 0, y: 340, w: 148, kind: 'k', title: 'HealthCheck', sub: 'kustomization', mono: true }),
      edge([[170, 368], [151, 368]], {}),
      edge([[74, 340], [74, 255]], { label: { x: 82, y: 300, t: 'health' } }),
      text({ x: 170, y: 420, t: 'or the Rollout sets a', role: 'note' }),
      text({ x: 170, y: 436, t: 'version on it instead', role: 'note' }),
    ].join('')
  }
};

// ============ datadog: a monitor in Alert fails the bake ============
figs.datadog = {
  title: 'Datadog monitors as health: a monitor in Alert makes the HealthCheck Unhealthy, which fails the bake',
  desc: 'The datadog-controller polls Datadog every 60 seconds for the monitors a HealthCheck of class datadog selects. A monitor in Alert makes the HealthCheck Unhealthy and stamps lastErrorTime; a Rollout baking a deploy made before that time marks the bake Failed.',
  wide: {
    w: 632, h: 160, body: [
      plate({ x: 0, y: 0, w: 140, kind: 'f', title: 'Datadog', sub: 'monitors' }),
      plate({ x: 164, y: 0, w: 140, kind: 'k', title: 'datadog-controller', sub: 'polls every 60s' }),
      plate({ x: 328, y: 0, w: 140, kind: 'k', title: 'HealthCheck', sub: 'class: datadog', mono: true }),
      plate({ x: 492, y: 0, w: 140, kind: 'k', key: true, title: 'Rollout', sub: 'bakes the deploy' }),
      edge([[140, 28], [161, 28]]),
      edge([[304, 28], [325, 28]], { kind: 'act' }),
      edge([[468, 28], [489, 28]]),
      chipSvg({ x: 14, cy: 92, text: 'Alert', state: 'red', anchor: 'start' }),
      chipSvg({ x: 342, cy: 92, text: 'Unhealthy', state: 'red', anchor: 'start' }),
      chipSvg({ x: 506, cy: 92, text: 'Failed', state: 'red', anchor: 'start' }),
      edge([[80, 92], [339, 92]], { kind: 'held', label: { x: 210, y: 84, t: 'one monitor alerting', anchor: 'middle' } }),
      edge([[446, 92], [503, 92]], { kind: 'held' }),
      text({ x: 342, y: 124, t: 'lastErrorTime', role: 'mono' }),
      text({ x: 342, y: 143, t: 'stamped', role: 'label' }),
      text({ x: 506, y: 124, t: ['error after the', 'deploy: bake fails'], role: 'label' }),
    ].join('')
  },
  narrow: {
    w: 318, h: 398, body: [
      plate({ x: 0, y: 0, w: 168, kind: 'f', title: 'Datadog', sub: 'monitors' }),
      chipSvg({ x: 192, cy: 28, text: 'Alert', state: 'red', anchor: 'start' }),
      edge([[84, 56], [84, 101]], { label: { x: 92, y: 84, t: 'polled every 60s' } }),
      plate({ x: 0, y: 104, w: 168, kind: 'k', title: 'datadog-controller' }),
      edge([[84, 144], [84, 181]], { kind: 'act', label: { x: 92, y: 168, t: 'writes status' } }),
      plate({ x: 0, y: 184, w: 168, kind: 'k', title: 'HealthCheck', sub: 'class: datadog', mono: true }),
      chipSvg({ x: 192, cy: 212, text: 'Unhealthy', state: 'red', anchor: 'start' }),
      text({ x: 192, y: 244, t: 'lastErrorTime', role: 'mono' }),
      edge([[84, 240], [84, 285]], { label: { x: 92, y: 266, t: 'read during bake' } }),
      plate({ x: 0, y: 288, w: 168, kind: 'k', key: true, title: 'Rollout', sub: 'bakes the deploy' }),
      chipSvg({ x: 192, cy: 316, text: 'Failed', state: 'red', anchor: 'start' }),
      text({ x: 0, y: 372, t: 'An error after the deploy fails the bake.', role: 'note' }),
    ].join('')
  }
};

// ============ release-stages: one release, left to right (what-is-kuberik) ============
const eyebrow = (x, y, t) => `<text class="df-glabel" x="${x}" y="${y}">${esc(t)}</text>`;
figs['release-stages'] = {
  title: 'One release from tag to record: detect, gate, deploy, verify, record',
  desc: 'Your CI pushes a tag to a registry. Kuberik detects it with a ReleaseSource, checks it against the RolloutGates (condition GatesPassing), and the Rollout hands it to Flux by setting a Kustomization substitute or an OCIRepository tag. HealthChecks verify the deploy while it bakes, Deploying then InProgress, and the Rollout records the result in its history as Succeeded or Failed. After a Failed bake automatic deploys stop until someone acts.',
  wide: {
    w: 632, h: 236, body: [
      eyebrow(0, 12, 'Your CI'), eyebrow(164, 12, 'Detect'), eyebrow(328, 12, 'Gate'), eyebrow(492, 12, 'Deploy'),
      plate({ x: 0, y: 24, w: 140, kind: 'f', title: 'Registry', sub: 'a new tag' }),
      plate({ x: 164, y: 24, w: 140, kind: 'k', title: 'ReleaseSource', sub: 'lists the tag' }),
      plate({ x: 328, y: 24, w: 140, kind: 'k', title: 'RolloutGate', sub: 'GatesPassing', mono: true }),
      plate({ x: 492, y: 24, w: 140, kind: 'f', title: 'Kustomization', sub: 'or OCIRepository' }),
      edge([[140, 52], [161, 52]]), edge([[304, 52], [325, 52]]), edge([[468, 52], [489, 52]], { kind: 'act' }),
      eyebrow(506, 132, 'Verify'), eyebrow(342, 132, 'Record'),
      edge([[600, 80], [600, 141]]),
      plate({ x: 492, y: 144, w: 140, kind: 'k', title: 'HealthCheck', sub: 'bakes the deploy' }),
      plate({ x: 328, y: 144, w: 140, kind: 'k', key: true, title: 'Rollout', sub: 'status.history', mono: true }),
      edge([[492, 172], [471, 172]]),
      edge([[328, 172], [278, 172]]),
      chipSvg({ x: 272, cy: 172, text: 'Failed', state: 'red', anchor: 'end' }),
      text({ x: 196, y: 176, t: 'or', anchor: 'middle' }),
      chipSvg({ x: 186, cy: 172, text: 'Succeeded', state: 'green', anchor: 'end' }),
      text({ x: 120, y: 212, t: ['Failed: automatic deploys stop', 'until someone acts.'] }),
    ].join('')
  },
  narrow: {
    w: 318, h: 560, body: [
      ...[['Your CI', 0], ['Detect', 80], ['Gate', 160], ['Deploy', 240], ['Verify', 320], ['Record', 400]].map(([t, y]) => eyebrow(0, y + 32, t)),
      plate({ x: 84, y: 0, w: 234, kind: 'f', title: 'Registry', sub: 'a new tag' }),
      plate({ x: 84, y: 80, w: 234, kind: 'k', title: 'ReleaseSource', sub: 'lists the tag' }),
      plate({ x: 84, y: 160, w: 234, kind: 'k', title: 'RolloutGate', sub: 'GatesPassing', mono: true }),
      plate({ x: 84, y: 240, w: 234, kind: 'f', title: 'Kustomization', sub: 'or OCIRepository' }),
      plate({ x: 84, y: 320, w: 234, kind: 'k', title: 'HealthCheck', sub: 'bakes the deploy' }),
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
  desc: 'Four writers make RolloutGates: a RolloutSchedule sets passing (schedule-gate-…), an ApprovalPolicy with RolloutApprovals sets allowedVersions (approval-gate-…), a RolloutDependency sets allowedVersions (dependency-<name>), and you or an Environment write one directly. The Rollout reads them all and reports the GatesPassing condition: AllGatesPassing, SomeGatesBlocking or NoAllowedVersions. Separately, an Unhealthy HealthCheck holds automatic deploys with DeploymentBlocked=True.',
  wide: {
    w: 632, h: 312, body: [
      plate({ x: 0, y: 0, w: 168, kind: 'k', title: 'RolloutSchedule', sub: ['a time window', '`passing`'] }),
      plate({ x: 0, y: 80, w: 168, kind: 'k', title: 'ApprovalPolicy', sub: ['+ RolloutApproval', '`allowedVersions`'] }),
      plate({ x: 0, y: 160, w: 168, kind: 'k', title: 'RolloutDependency', sub: ['upstream baked', '`allowedVersions`'] }),
      plate({ x: 0, y: 240, w: 168, kind: 'n', title: 'You or an Environment', sub: ['write one directly', '`either field`'] }),
      edge([[168, 36], [204, 36], [204, 146], [221, 146]]),
      edge([[168, 116], [196, 116], [196, 164], [221, 164]]),
      edge([[168, 196], [188, 196], [188, 182], [221, 182]]),
      edge([[168, 276], [180, 276], [180, 200], [221, 200]]),
      stack({ x: 224, y: 104, w: 196, h: 112 }),
      plate({ x: 224, y: 104, w: 196, h: 112, kind: 'k', title: 'RolloutGate', sub: ['schedule-gate-…', 'approval-gate-…', 'dependency-<name>', 'your name, ghd-…'], mono: true }),
      edge([[428, 160], [469, 160]]),
      plate({ x: 472, y: 132, w: 160, kind: 'k', key: true, title: 'Rollout', sub: 'GatesPassing', mono: true }),
      reasonRows(472, 216),
      plate({ x: 472, y: 0, w: 160, kind: 'k', title: 'HealthCheck', sub: 'Unhealthy', mono: true }),
      edge([[600, 56], [600, 129]], { kind: 'held' }),
      text({ x: 592, y: 92, t: 'DeploymentBlocked=True', role: 'mono', anchor: 'end' }),
    ].join('')
  },
  narrow: {
    w: 318, h: 520, body: [
      plate({ x: 0, y: 0, w: 155, kind: 'k', title: 'RolloutSchedule', sub: ['a time window', '`passing`'] }),
      plate({ x: 163, y: 0, w: 155, kind: 'k', title: 'ApprovalPolicy', sub: ['+ RolloutApproval', '`allowedVersions`'] }),
      plate({ x: 0, y: 80, w: 155, kind: 'k', title: 'RolloutDependency', sub: ['upstream baked', '`allowedVersions`'] }),
      plate({ x: 163, y: 80, w: 155, kind: 'n', title: 'You, Environment', sub: ['write one directly', '`either field`'] }),
      edge([[159, 152], [159, 197]], { label: { x: 167, y: 180, t: 'each writes one' } }),
      stack({ x: 0, y: 208, w: 306, h: 112 }),
      plate({ x: 0, y: 208, w: 306, h: 112, kind: 'k', title: 'RolloutGate', sub: ['schedule-gate-…', 'approval-gate-…', 'dependency-<name>', 'your name, ghd-…'], mono: true }),
      edge([[80, 320], [80, 365]]),
      plate({ x: 0, y: 368, w: 160, kind: 'k', key: true, title: 'Rollout', sub: 'GatesPassing', mono: true }),
      reasonRows(0, 452),
      plate({ x: 186, y: 368, w: 132, kind: 'k', title: 'HealthCheck', sub: 'Unhealthy', mono: true }),
      edge([[186, 396], [163, 396]], { kind: 'held' }),
      text({ x: 186, y: 446, t: 'DeploymentBlocked', role: 'mono' }),
      text({ x: 186, y: 464, t: '=True', role: 'mono' }),
    ].join('')
  }
};

for (const [id, f] of Object.entries(figs)) {
  const html = `{{/* GENERATED by scripts/docs-figs.mjs: edit the generator, not this file. */}}\n` +
    svg(id, 'wide', f.wide, f.title, f.desc) + '\n' + svg(id, 'narrow', f.narrow, f.title, f.desc) + '\n';
  writeFileSync(join(outDir, `${id}.html`), html);
  console.log('wrote', id);
}
