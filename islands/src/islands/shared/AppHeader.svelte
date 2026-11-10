<svelte:options runes={true} />
<script lang="ts">
	/**
	 * The app page's header, for every landing window that is "this app, this build": glyph, 24 name, 20 mono build, the tab's pill, the commit line, then the
	 * env strip (PromotionLane). REFERENCE: /apps/<name> `AppDetail.svelte` header (same classes, same proportions); drawn from `identityOf`/`laneOfApp`, so every word is
	 * the product's. Stars and the "All environments" link are left out (a window is not navigable).
	 */
	import AppGlyph from '$lib/components/AppGlyph.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import Chip from '$lib/components/Chip.svelte';
	import PromotionLane from '$lib/components/PromotionLane.svelte';
	import { CodeBranchOutline, ClockOutline } from 'flowbite-svelte-icons';
	import { avatarSrc } from '$lib/components/new/data';
	import { plural, VIEWER } from '$lib/components/new/rollout-view';
	import type { identityOf, laneOfApp, AppIdentity } from './app-model';
	let { app, who, lane, cur, yours = false, hrefFor }: {
		app: string; who: ReturnType<typeof identityOf> | AppIdentity; lane: ReturnType<typeof laneOfApp>; cur: { ns: string; name: string } | null; yours?: boolean;
		hrefFor: (n: { card: unknown }) => string;
	} = $props();
</script>
<header class="flex min-w-0 flex-col gap-3 px-4 pt-4 sm:px-6 sm:pt-5">
	<div class="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
		<AppGlyph name={app} size={24} />
		<h1 class="t-title min-w-0 break-words text-fg">{app}</h1>
		<span class="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 max-sm:basis-full">
			<span class="t-meta text-fg-disabled max-sm:hidden" aria-hidden="true">/</span>
			<span class="t-code-lg shrink-0 text-fg" data-story-build>{who.build}</span>
			{#if who.pill}<Chip role={who.pill.role as never} label={who.pill.word.toLowerCase()} class="shrink-0" />{/if}
			{#if 'runs' in who && who.build && who.runs.length}<span class="t-meta text-fg-subtle">in</span><span class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">{#each who.runs as b (b.label)}<Chip role="env" theme={b.theme} label={b.label} wide />{/each}</span>{/if}
		</span>
	</div>
	{#if who.commit}
		<div class="t-meta flex min-w-0 items-center gap-x-3 text-fg-muted" data-story-commit>
			<span class="flex min-w-0 items-center gap-2">
				{#if who.commit.who && who.commit.who !== VIEWER}<Avatar name={who.commit.who} src={avatarSrc(who.commit.who)} size={16} class="shrink-0 max-sm:hidden" />{/if}{#if who.commit.who}<span class="shrink-0 whitespace-nowrap max-sm:sr-only">{who.commit.who === VIEWER ? 'you' : who.commit.who}</span>{/if}
				<CodeBranchOutline class="h-3.5 w-3.5 shrink-0 text-fg-disabled max-sm:hidden" aria-hidden="true" /><span class="min-w-0 truncate text-fg-subtle max-sm:hidden">{who.commit.title}</span>
			</span>
			{#if who.age}<span class="inline-flex shrink-0 items-center gap-2 whitespace-nowrap tabular-nums text-fg-subtle"><ClockOutline class="h-3.5 w-3.5 shrink-0" aria-hidden="true" />{'runs' in who ? 'deployed ' : ''}{who.age} ago</span>{/if}
			{#if 'newer' in who && who.newer}<span class="shrink-0 whitespace-nowrap text-fg-subtle">{plural(who.newer, 'newer build')}</span>{/if}
		</div>
	{/if}
	{#if lane}
		<div class="min-w-0" data-story-strip><PromotionLane {lane} showApp={false} words {yours} mutedRest {hrefFor} current={cur} /></div>
	{/if}
</header>
