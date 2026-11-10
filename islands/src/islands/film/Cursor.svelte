<svelte:options runes={true} />
<script lang="ts">
	/** The pointer: NEW BY DESIGN (STORYBOARD cursor rule), the only thing in a window that is not a dashboard component. It appears for exactly four presses, each a person
	 *  deciding. Desktop: an arrow (white stroke, ink fill; reversed in dark). Phone: a 28 px touch disc. Position is canvas px; the travel is 270-300 ms ease. */
	let { x, y, on, press, touch }: { x: number; y: number; on: boolean; press: boolean; touch: boolean } = $props();
</script>
<span class="kc" class:kc-on={on} class:kc-press={press} class:kc-touch={touch} style="transform: translate3d({x}px, {y}px, 0)" aria-hidden="true">
	{#if touch}<i class="kc-disc"></i>{:else}<svg class="kc-arrow" width="22" height="26" viewBox="0 0 22 26"><path d="M3 2l15 11.4-6.4 1.1 3.6 7.2-3.1 1.5-3.6-7.2L3 20z" stroke-width="1.6" stroke-linejoin="round" /></svg>{/if}
	<i class="kc-ring"></i>
</span>
<style>
	.kc { position: absolute; left: 0; top: 0; z-index: 90; width: 22px; height: 26px; margin: -3px 0 0 -4px; opacity: 0; pointer-events: none; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease; will-change: transform; }
	.kc-on { opacity: 1; }
	.kc-arrow { filter: drop-shadow(0 2px 3px rgba(18, 26, 32, 0.3)); fill: #121a20; stroke: #fff; transition: transform 0.12s ease; transform-origin: 3px 2px; }
	:global(.dark) .kc-arrow { fill: #fff; stroke: #121a20; }
	.kc-press .kc-arrow { transform: scale(0.88); }
	.kc-touch { margin: -14px 0 0 -14px; width: 28px; height: 28px; }
	.kc-disc { display: block; width: 28px; height: 28px; border-radius: 50%; background: color-mix(in srgb, #121a20 18%, transparent); transition: transform 0.12s ease; }
	:global(.dark) .kc-disc { background: color-mix(in srgb, #fff 22%, transparent); box-shadow: 0 0 0 2px #fff; }
	.kc-press .kc-disc { transform: scale(0.9); }
	.kc-ring { position: absolute; left: 1px; top: 1px; width: 26px; height: 26px; margin: -13px 0 0 -13px; border-radius: 50%; border: 2px solid var(--k-blue-solid, #2563eb); opacity: 0; transform: scale(0.4); }
	.kc-touch .kc-ring { left: 14px; top: 14px; }
	.kc-press .kc-ring { animation: kc-press 0.12s ease-out forwards, kc-spread 0.28s ease-out; }
	@keyframes kc-spread { 0% { opacity: 0.9; transform: scale(0.4); } 100% { opacity: 0; transform: scale(1.5); } }
	@keyframes kc-press { to {} }
</style>
