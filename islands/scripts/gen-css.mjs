// Derives the island stylesheet ENTRY from the dashboard's own app.css, so tokens and utilities stay the product's.
// Differences from app.css (each one is a size or scope decision, nothing is restyled):
//   - `@import 'tailwindcss'` gets source(none): Tailwind scans ONLY the @source lines below (the components islands use),
//     not the whole checkout;
//   - the two flowbite-svelte @source lines and the flowbite / typography plugins are dropped (no island uses them);
//   - language.css is imported by absolute path (the dashboard's design tokens + roles, untouched).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
const D = process.env.DASHBOARD_SRC;
const app = readFileSync(resolve(D, 'src/app.css'), 'utf8');
const sources = readFileSync(new URL('../sources.txt', import.meta.url), 'utf8').split('\n').map((s) => s.trim()).filter((s) => s && !s.startsWith('#'));
let css = app
	.replace(/@import 'tailwindcss';/, "@import 'tailwindcss' source(none);")
	.replace(/@import '\.\/styles\/language\.css';/, `@import '${resolve(D, 'src/styles/language.css')}';`)
	.replace(/@plugin 'flowbite\/plugin';\n?/, '')
	.replace(/@plugin '@tailwindcss\/typography';\n?/, '')
	.replace(/@source "\.\.\/node_modules\/[^"]+";\n?/g, '');
css += '\n' + sources.map((s) => `@source "${resolve(D, 'src', s)}";`).join('\n') + '\n';
mkdirSync(new URL('../.gen', import.meta.url), { recursive: true });
writeFileSync(new URL('../.gen/island.css', import.meta.url), css);
console.log(`island.css: ${css.length} bytes, ${sources.length} @source entries`);
