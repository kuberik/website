/**
 * NAMED STUB: `scrollIntoView` for the product inside the film. The product calls it (the rollout tab strip brings its active tab into view, the version
 * list its selection) assuming the document is the page; natively it would also scroll the LANDING page, yanking the reader away from the hero. For elements
 * inside the film's shadow root only the film's own scroll containers move (`nearest` semantics); the host page never does. Every other element is untouched.
 */
let installed = false;
export function containScroll() {
	if (installed) return;
	installed = true;
	const native = Element.prototype.scrollIntoView;
	Element.prototype.scrollIntoView = function (this: Element, arg?: boolean | ScrollIntoViewOptions) {
		const root = this.getRootNode();
		if (!(root instanceof ShadowRoot) || !(root.host as HTMLElement).dataset?.island) return native.call(this, arg as ScrollIntoViewOptions);
		const smooth = typeof arg === 'object' && arg?.behavior === 'smooth';
		for (let p: Element | null = this.parentElement; p; p = p.parentElement) {
			if (p.classList.contains('film-canvas')) break;
			const cs = getComputedStyle(p);
			if (!/(auto|scroll)/.test(cs.overflowY) && !/(auto|scroll)/.test(cs.overflowX)) continue;
			const a = this.getBoundingClientRect(), b = p.getBoundingClientRect();
			const k = p.clientHeight ? b.height / p.clientHeight : 1; // canvas scale
			let dy = 0, dx = 0;
			if (a.top < b.top) dy = (a.top - b.top) / k; else if (a.bottom > b.bottom) dy = (a.bottom - b.bottom) / k;
			if (a.left < b.left) dx = (a.left - b.left) / k; else if (a.right > b.right) dx = (a.right - b.right) / k;
			if (dy || dx) p.scrollBy({ top: dy, left: dx, behavior: smooth ? 'smooth' : 'auto' });
		}
	};
}
