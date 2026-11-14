/**
 * BACKSTOP: the landing has no dashboard API. Every request the product makes is answered by a stub or a scope (vite.config.ts STUBBED_MODULES,
 * shared/scope.ts, the film's installFetch); one that is not would reach the web server as a same-origin `/api/...` 404 and a console error.
 * `noApi(f)` wraps a fetch so such a request never leaves the page: it answers 503 `{"error":"island: no API"}` (the product's error paths take it
 * as a server failure) and warns once per path, so a missing stub is still found (a console warning, not a network request).
 * Installed innermost: sections wrap `window.fetch` with it when nothing has; the film's installFetch passes what it does not answer through it.
 */
const warned = new Set<string>();

export function noApi(f: typeof fetch): typeof fetch {
	if ((f as any).__noApi) return f;
	const g = (input: RequestInfo | URL, init?: RequestInit) => {
		let u: URL | null = null;
		try { u = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url, location.href); } catch { /* not a URL: pass */ }
		if (u && u.origin === location.origin && u.pathname.startsWith('/api/')) {
			if (!warned.has(u.pathname)) { warned.add(u.pathname); console.warn(`island: ${u.pathname} refused (no stub answers it; the landing has no API)`); }
			return Promise.resolve(new Response(JSON.stringify({ error: 'island: no API' }), { status: 503, headers: { 'content-type': 'application/json' } }));
		}
		return f(input, init);
	};
	(g as any).__noApi = true;
	return g as typeof fetch;
}

/** wrap `window.fetch` once, unless the film's wrapper (which passes through `noApi` itself) or an earlier call already did */
export function refuseApi(): void {
	const cur = window.fetch as any;
	if (cur.__noApi || cur.__film) return;
	window.fetch = noApi(window.fetch.bind(window));
}
