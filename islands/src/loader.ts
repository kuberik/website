/**
 * Island LOADER: the only code a page ships eagerly (about 1 KB). Finds `[data-island]` hosts and imports the runtime + the island's own
 * chunk when the host is within one viewport of the screen (IntersectionObserver rootMargin), so a section far down the page costs
 * nothing until the reader nears it. Hosts marked `data-eager` (the hero) start on idle right after load: never ahead of first paint.
 * Hugo markup: <div data-island="name" data-theme-sync style="min-height:Npx"></div> (the box reserves the island's size: no layout shift).
 */
const BASE = new URL('.', /* @vite-ignore */ import.meta.url).href;
let runtime: Promise<typeof import('./runtime')> | undefined;
const start = (host: HTMLElement) => {
	runtime ??= import('./runtime');
	void runtime.then((r) => r.mountIsland(host, BASE));
};
const seen = new WeakSet<Element>();
const idle = (f: () => void) => ('requestIdleCallback' in window ? (window as any).requestIdleCallback(f, { timeout: 800 }) : setTimeout(f, 200));

function scan(scope: ParentNode = document) {
	const io = (scan as any).io ??= new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); start(e.target as HTMLElement); } }), { rootMargin: `${Math.max(innerHeight, 600)}px 0px` });
	scope.querySelectorAll<HTMLElement>('[data-island]').forEach((h) => {
		if (seen.has(h)) return;
		seen.add(h);
		if (h.hasAttribute('data-eager')) idle(() => start(h)); else io.observe(h);
	});
}
const go = () => scan();
if (document.readyState === 'complete') go(); else addEventListener('load', go, { once: true });
(window as any).kuberikIslands = { scan };
