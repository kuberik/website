import { defineConfig, type Plugin } from 'vite';
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const D = process.env.DASHBOARD_SRC;
if (!D) throw new Error('DASHBOARD_SRC not set; run islands/build.sh');
const S = (p: string) => resolve(HERE, 'src/stubs', p);

/** Dashboard modules that drag the app (fixtures, GitHub reader, query layer) into a component's import graph.
 *  Keyed by path relative to the dashboard's src/; replaced by a stub wherever any file imports them. Never edits the dashboard. */
const STUBBED_MODULES: Record<string, string> = {
	'lib/view-models/home/fixture.ts': 'home-fixture.ts',
	'lib/components/new/github-read.svelte.ts': 'github-read.svelte.ts',
	'lib/view-models/home/fixtures/incident-input.json': 'incident-input.json',
	'lib/demo/github-data.ts': 'demo-github-data.ts',
	'lib/stores/time.ts': 'time-store.ts',
	'lib/components/new/FleetGate.svelte': 'fleet-gate.svelte'
};

function stubModules(): Plugin {
	const byAbs = new Map(Object.entries(STUBBED_MODULES).map(([k, v]) => [resolve(D!, 'src', k), S(v)]));
	return {
		name: 'kuberik-island-stubs',
		enforce: 'pre',
		async resolveId(source, importer, opts) {
			if (!importer || !(source.startsWith('.') || source.startsWith('/') || source.startsWith('$lib'))) return null;
			const r = await this.resolve(source, importer, { ...opts, skipSelf: true });
			return r && byAbs.get(r.id.replace(/\?.*$/, '')) ? byAbs.get(r.id.replace(/\?.*$/, ''))! : null;
		}
	};
}

/** NAMED STUB: the product's age formatters (utils.ts) default their `now` to `new Date()`, the REAL clock; on the landing the story has its own clock (the time-store stub), so
 *  "Built 10 hours ago" printed a real-world 10 h gap for a build the story made 40 minutes ago. Their default is rewritten to the story's now (the real clock until a story drives it). */
function storyNow(): Plugin {
	return {
		name: 'kuberik-island-story-now',
		enforce: 'pre',
		transform(code, id) {
			if (!/\/src\/lib\/utils\.ts$/.test(id.replace(/\?.*$/, '')) || !code.includes('new Date()')) return null;
			return { code: `import { storyDate } from ${JSON.stringify(S('time-store.ts'))};\n` + code.replace(/(=|\?\?) new Date\(\)/g, '$1 storyDate()'), map: null };
		}
	};
}

/** NO TRACE: the dashboard's modules keep preferences in localStorage / sessionStorage (Sidebar's 'sidebar-collapsed', the display time zone the film sets,
 *  theme, stars, scroll memory, skeleton shapes). Bundled into a kuberik.com island those would write into the VISITOR's storage. Every `localStorage` /
 *  `sessionStorage` (and `window.`-qualified) in the dashboard's src is rewritten to the in-memory pair in stubs/island-storage.ts, and paraglide's cookie strategy is dropped. */
function islandStorage(): Plugin {
	const src = resolve(D!, 'src') + '/';
	return {
		name: 'kuberik-island-storage',
		enforce: 'pre',
		transform(code, id) {
			const f = id.replace(/\?.*$/, '');
			if (!f.startsWith(src)) return null;
			/* paraglide's locale strategy starts with "cookie": its first getLocale() writes PARAGLIDE_LOCALE (max-age 400 days) on the visitor's domain. The island keeps
			   the locale in its global variable only (en, the base locale) */
			if (f.endsWith('/lib/paraglide/runtime.js')) {
				const out = code.replace(/(export const strategy = \[)([^\]]*)\]/, (_m, a, list) => a + list.split(',').filter((x: string) => !/"(cookie|localStorage)"/.test(x)).join(',') + ']');
				if (out === code || /"cookie"/.test(out.match(/export const strategy = \[[^\]]*\]/)?.[0] ?? '"cookie"')) throw new Error('island-storage: paraglide strategy not rewritten');
				return { code: out, map: null };
			}
			if (!/\b(local|session)Storage\b/.test(code)) return null;
			const out = code.replace(/\b(?:window\.|globalThis\.)?(local|session)Storage\b/g, (_m, k) => (k === 'local' ? '__islandLocal' : '__islandSession'));
			const imp = `import { islandLocal as __islandLocal, islandSession as __islandSession } from ${JSON.stringify(S('island-storage.ts'))};\n`;
			/* .svelte: the import goes inside the instance <script> (first one without context="module" ... either works for a module-level const) */
			if (f.endsWith('.svelte')) return { code: out.replace(/<script(\s[^>]*)?>/, (m) => m + '\n' + imp), map: null };
			return { code: imp + out, map: null };
		}
	};
}

/** Post-process the compiled stylesheet for shadow-root use:
 *  - `:root` -> `:host` (the dashboard defines its --k-* tokens on :root; inside a shadow tree that is the host);
 *  - @font-face is dropped (a shadow-root stylesheet cannot register fonts) and the faces are declared in the DOCUMENT by
 *    main.ts under a private family name, so hextra's own fonts are never touched. */
function shadowCss(): Plugin {
	return {
		name: 'kuberik-island-shadow-css',
		enforce: 'post',
		generateBundle(_o, bundle) {
			for (const f of Object.values(bundle)) {
				if (f.type !== 'asset' || !f.fileName.endsWith('.css')) continue;
				let css = String(f.source);
				css = css.replace(/@font-face\s*\{[^}]*\}/g, '');
				css = css.replace(/:root\b/g, ':host');
				/* viewport queries -> the island's CANVAS (container "kc"): the product's `sm:`/`lg:` layouts answer the dashboard viewport it is drawn in
				   (a real 1440 or 390 canvas inside the window), not the host page's. Width ranges in px/rem only; every other at-rule is untouched. */
				css = css.replace(/@media\s*\(\s*(width\s*[<>]=?\s*[\d.]+(?:rem|px)|(?:min|max)-width\s*:\s*[\d.]+(?:rem|px))\s*\)/g, '@container kc ($1)');
				css = css.replace(/'Inter'/g, "'Kuberik Inter'").replace(/"Inter"/g, "'Kuberik Inter'").replace(/'JetBrains Mono'/g, "'Kuberik JetBrains Mono'");
				f.source = css;
			}
		}
	};
}

/** writes .gen/modules.txt: every module that made it into the JS, with rendered bytes (the bundle-weight audit). */
function moduleReport(): Plugin {
	return {
		name: 'kuberik-island-module-report',
		generateBundle(_o, bundle) {
			const rows: string[] = [];
			// who pulls the heavy fixtures in? (importers of every module the audit flags)
			const why: string[] = [];
			for (const id of this.getModuleIds()) if (/incident-input|demo\/mock-data|demo\/github-data/.test(id)) why.push(id.replace(D!, '$DASH') + ' <- ' + (this.getModuleInfo(id)?.importers ?? []).map((i) => i.replace(D!, '$DASH')).join(', '));
			mkdirSync(resolve(HERE, '.gen'), { recursive: true });
			writeFileSync(resolve(HERE, '.gen/why.txt'), why.join('\n') + '\n');
			for (const f of Object.values(bundle)) if (f.type === 'chunk') for (const [id, m] of Object.entries(f.modules)) rows.push(`${String(m.renderedLength).padStart(8)}  ${f.fileName.replace(/-[A-Za-z0-9_-]{8}\.js$/, "")}  ${id.replace(HERE, '').replace(D!, '$DASH')}`);
			mkdirSync(resolve(HERE, '.gen'), { recursive: true });
			writeFileSync(resolve(HERE, '.gen/modules.txt'), rows.sort((a, b) => +b.slice(0, 8) - +a.slice(0, 8)).join('\n') + '\n');
		}
	};
}

export default defineConfig({
	root: HERE,
	publicDir: false,
	resolve: {
		alias: [
			{ find: /^@tanstack\/svelte-query$/, replacement: S('svelte-query.svelte.ts') },
			{ find: /^tailwind-merge$/, replacement: S('tailwind-merge.ts') },
			{ find: /^flowbite-svelte$/, replacement: S('flowbite-svelte.ts') },
			{ find: /^\$lib\/?/, replacement: resolve(D, 'src/lib') + '/' },
			// SvelteKit-only virtual modules: inert stand-ins, never the real router/env.
			{ find: /^\$app\/(.*)$/, replacement: S('app-$1.ts') },
			{ find: /^\$env\/(.*)$/, replacement: S('env.ts') }
		]
	},
	plugins: [
		stubModules(),
		islandStorage(),
		storyNow(),
		tailwindcss(),
		svelte({ configFile: false, preprocess: vitePreprocess(), compilerOptions: { runes: undefined, css: 'external' } }),
		shadowCss(),
		moduleReport()
	],
	base: './',
	build: {
		outDir: process.env.ISLANDS_OUT ? resolve(process.env.ISLANDS_OUT) : resolve(HERE, '../static/islands'),
		emptyOutDir: true,
		target: 'es2022',
		minify: process.env.ISLANDS_DEBUG ? false : undefined,
		cssCodeSplit: false,
		modulePreload: false,
		rollupOptions: {
			input: resolve(HERE, 'src/loader.ts'),
			preserveEntrySignatures: false,
			output: {
				entryFileNames: 'islands.js',
				chunkFileNames: 'chunks/[name]-[hash].js',
				assetFileNames: (a) => (a.names?.[0]?.endsWith('.css') ? 'islands.css' : 'assets/[name][extname]'),
				/* svelte's runtime is its own chunk (cached across deploys of the dashboard code); the rest splits by who imports it */
				manualChunks: (id) => (/node_modules\/\.pnpm\/svelte@|node_modules\/svelte\//.test(id) ? 'svelte' : undefined)
			}
		}
	}
});
