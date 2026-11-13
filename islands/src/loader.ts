/**
 * Island LOADER: the only code a page ships eagerly (about 1 KB). Finds `[data-island]` hosts and imports the runtime + the island's own
 * chunk when the host is within one viewport of the screen (IntersectionObserver rootMargin), so a section far down the page costs
 * nothing until the reader nears it. Hosts marked `data-eager` (the hero) start as soon as the loader runs (a static placeholder fills the box until then).
 * Hugo markup: <div data-island="name" data-theme-sync style="min-height:Npx"></div> (the box reserves the island's size: no layout shift).
 */
const BASE = new URL('.', /* @vite-ignore */ import.meta.url).href;
let runtime: Promise<typeof import('./runtime')> | undefined;
const start = (host: HTMLElement) => {
	runtime ??= import('./runtime');
	void runtime.then((r) => r.mountIsland(host, BASE));
};
/* a section island never competes with the hero's first frame: it starts once every eager island has painted live (runtime ready()), or after 8 s */
let eagerDone: Promise<unknown> | undefined;
const afterEager = () => (eagerDone ??= new Promise<void>((res) => {
	const left = () => [...document.querySelectorAll('[data-island][data-eager]')].filter((h) => !h.hasAttribute('data-island-ready')).length;
	if (!left()) return res();
	const on = () => { if (!left()) { document.removeEventListener('kuberik:island-ready', on); res(); } };
	document.addEventListener('kuberik:island-ready', on);
	setTimeout(res, 8000);
}));
const seen = new WeakSet<Element>();

function scan(scope: ParentNode = document) {
	const io = (scan as any).io ??= new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); void afterEager().then(() => start(e.target as HTMLElement)); } }), { rootMargin: `${Math.max(innerHeight, 600)}px 0px` });
	scope.querySelectorAll<HTMLElement>('[data-island]').forEach((h) => {
		if (seen.has(h)) return;
		seen.add(h);
		if (h.hasAttribute('data-eager')) start(h); else io.observe(h);
	});
}
scan(); // module scripts run after parsing: the hero (data-eager) starts now, never waiting for load or idle
(window as any).kuberikIslands = { scan };
