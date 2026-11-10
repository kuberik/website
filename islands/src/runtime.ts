/**
 * Island runtime (shared chunk, loaded by loader.ts on the first island that needs it): shadow root, the one shared constructable
 * stylesheet (islands.css, the dashboard's own compiled CSS), fonts, theme sync, and the three play gates.
 * `data-theme-sync` mirrors <html class="dark"> onto the island wrapper.
 */
import '../.gen/island.css';
import './island-base.css';
import { mount } from 'svelte';
import { registry } from './registry';
import { Timeline } from './timeline';
import { reactive as makeProps } from './reactive.svelte';

/** @font-face must live in the DOCUMENT (shadow-root stylesheets cannot register fonts). Private family names, so a host
 *  page's own 'Inter' is never touched; compiled CSS uses the same names (vite.config.ts shadowCss). */
function declareFonts(BASE: string) {
	if (document.getElementById('kuberik-islands-fonts')) return;
	const f = (n: string) => new URL(`fonts/${n}`, BASE).href;
	const s = document.createElement('style');
	s.id = 'kuberik-islands-fonts';
	s.textContent = `
@font-face{font-family:'Kuberik Inter';font-style:normal;font-display:swap;font-weight:100 900;src:url('${f('inter-latin-opsz.woff2')}') format('woff2-variations');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2197,U+21B5,U+25A8,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:'Kuberik Inter';font-style:normal;font-display:swap;font-weight:100 900;src:url('${f('inter-latin-ext-opsz.woff2')}') format('woff2-variations');unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}
@font-face{font-family:'Kuberik JetBrains Mono';font-style:normal;font-display:swap;font-weight:100 800;src:url('${f('jetbrains-mono-latin.woff2')}') format('woff2-variations')}`;
	document.head.appendChild(s);
}

let sheet: Promise<CSSStyleSheet> | null = null;
const sharedSheet = (BASE: string) => (sheet ??= fetch(new URL('islands.css', BASE)).then((r) => r.text()).then((css) => { const s = new CSSStyleSheet(); s.replaceSync(css);
	/* Tailwind v4 declares its `--tw-*` defaults with @property, and @property is IGNORED inside a shadow tree: `border-2` then computed to border-style:none (no spinner arc, no ring). Register them on the document, where they apply inside the shadow root too. */
	const props = css.match(/@property\s+--[\w-]+\s*\{[^}]*\}/g);
	if (props) { const d = new CSSStyleSheet(); d.replaceSync(props.join('\n')); document.adoptedStyleSheets = [...document.adoptedStyleSheets, d]; }
	return s; }));

const dark = () => document.documentElement.classList.contains('dark');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');

export async function mountIsland(host: HTMLElement, BASE: string) {
	const name = host.dataset.island!;
	const load = registry[name];
	if (!load) { console.warn(`island "${name}" is not registered`); return; }
	declareFonts(BASE);
	const [def, css] = await Promise.all([load(), sharedSheet(BASE)]);
	const root = host.shadowRoot ?? host.attachShadow({ mode: 'open' });
	root.adoptedStyleSheets = [css];
	if (host.querySelector('.ph-poster')) { const slot = document.createElement('slot'); root.appendChild(slot); } // the static first frame stays (slotted, above the island) until ready()
	const wrap = document.createElement('div');
	wrap.className = 'k-island';
	root.appendChild(wrap);

	if (host.hasAttribute('data-theme-sync')) {
		const sync = () => wrap.classList.toggle('dark', dark());
		sync();
		new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
	}

	if ('custom' in def) {
		const cbs: ((g: 'onscreen' | 'visible' | 'motion', v: boolean) => void)[] = [];
		const fire = (g: 'onscreen' | 'visible' | 'motion', v: boolean) => cbs.forEach((f) => f(g, v));
		const ready = () => { const p = host.querySelector<HTMLElement>('.ph-poster'); if (!p) return; p.style.opacity = '0'; host.querySelector('.ph-chapters')?.remove(); setTimeout(() => p.remove(), 220); };
		def.custom({ wrap, host, onGate: (cb) => cbs.push(cb), ready });
		fire('motion', !reduced.matches);
		fire('visible', document.visibilityState === 'visible');
		reduced.addEventListener('change', () => fire('motion', !reduced.matches));
		document.addEventListener('visibilitychange', () => fire('visible', document.visibilityState === 'visible'));
		new IntersectionObserver((es) => fire('onscreen', es[es.length - 1].isIntersecting), { threshold: 0.25 }).observe(host);
		return;
	}
	// Svelte 5: a $state proxy as `props` makes later assignments re-render the component in place.
	const props = makeProps(def.initial);
	mount(def.component, { target: wrap, props });

	const tl = new Timeline<any>({ beats: def.beats, restMs: def.restMs, representative: def.representative, apply: (s) => Object.assign(props, s) });
	tl.setGate('motion', !reduced.matches);
	reduced.addEventListener('change', () => { tl.setGate('motion', !reduced.matches); renderControls(); });
	new IntersectionObserver((es) => tl.setGate('onscreen', es[es.length - 1].isIntersecting), { rootMargin: '80px' }).observe(host);
	document.addEventListener('visibilitychange', () => tl.setGate('visible', document.visibilityState === 'visible'));

	// Reduced motion: no autoplay; the beats are reachable by an explicit control.
	let ctl: HTMLElement | null = null;
	function renderControls() {
		ctl?.remove(); ctl = null;
		if (!reduced.matches) return;
		ctl = document.createElement('div');
		ctl.className = 'k-island-ctl';
		ctl.innerHTML = '<button class="btn btn-secondary" type="button">Next step</button>';
		ctl.querySelector('button')!.addEventListener('click', () => tl.next());
		root.appendChild(ctl);
	}
	renderControls();
	(host as any).__timeline = tl;
}
