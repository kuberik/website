import { defineConfig, mergeConfig } from 'vitest/config';
import base from './vite.config';
// Same aliases, stubs and svelte compile as the build (so the dashboard's own view-model code runs exactly as it will in the page),
// but no tailwind: unit tests assert data, not pixels. DASHBOARD_SRC must be set (`npm test` does).
const plugins = ((base as any).plugins as any[]).flat().filter((p: any) => !String(p?.name ?? '').includes('tailwind'));
export default mergeConfig({ ...base, plugins }, defineConfig({ resolve: { conditions: ['browser'] }, test: { include: ['src/**/*.test.ts'], environment: 'node', server: { deps: { inline: [/flowbite/, /svelte/] } } } }));
