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
	'lib/components/new/data.ts': 'new-data.ts',
	'lib/components/atoms/atoms-live.svelte.ts': 'atoms-live.ts'
};

function stubModules(): Plugin {
	const byAbs = new Map(Object.entries(STUBBED_MODULES).map(([k, v]) => [resolve(D!, 'src', k), S(v)]));
	return {
		name: 'kuberik-island-stubs',
		enforce: 'pre',
		async resolveId(source, importer, opts) {
			if (!importer || !(source.startsWith('.') || source.startsWith('$lib'))) return null;
			const r = await this.resolve(source, importer, { ...opts, skipSelf: true });
			return r && byAbs.get(r.id.replace(/\?.*$/, '')) ? byAbs.get(r.id.replace(/\?.*$/, ''))! : null;
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
			for (const f of Object.values(bundle)) if (f.type === 'chunk') for (const [id, m] of Object.entries(f.modules)) rows.push(`${String(m.renderedLength).padStart(8)}  ${id.replace(HERE, '').replace(D!, '$DASH')}`);
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
			{ find: /^tailwind-merge$/, replacement: S('tailwind-merge.ts') },
			{ find: /^\$lib\/?/, replacement: resolve(D, 'src/lib') + '/' },
			// SvelteKit-only virtual modules: inert stand-ins, never the real router/env.
			{ find: /^\$app\/(.*)$/, replacement: S('app-$1.ts') },
			{ find: /^\$env\/(.*)$/, replacement: S('env.ts') }
		]
	},
	plugins: [
		stubModules(),
		tailwindcss(),
		svelte({ configFile: false, preprocess: vitePreprocess(), compilerOptions: { runes: undefined, css: 'external' } }),
		shadowCss(),
		moduleReport()
	],
	build: {
		outDir: resolve(HERE, '../static/islands'),
		emptyOutDir: true,
		target: 'es2022',
		cssCodeSplit: false,
		lib: { entry: resolve(HERE, 'src/main.ts'), formats: ['es'], fileName: () => 'islands.js' },
		rollupOptions: { output: { inlineDynamicImports: true, assetFileNames: (a) => (a.names?.[0]?.endsWith('.css') ? 'islands.css' : 'assets/[name][extname]') } }
	}
});
