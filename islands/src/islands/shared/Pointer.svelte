<svelte:options runes={true} />
<script lang="ts">
	/** The page's pointer: NEW BY DESIGN (SPEC 2.2), the only thing in a window that is not a dashboard component. A person presses in two places on
	 *  the landing (Approve, Roll back); an animation without a press would show automation. Position is the host's (`x`,`y` in window px). */
	let { x, y, on, press }: { x: number; y: number; on: boolean; press: boolean } = $props();
</script>
<span class="hw-ptr" class:hw-ptr-on={on} class:hw-ptr-press={press} style="transform: translate({x}px, {y}px)" aria-hidden="true">
	<svg width="22" height="26" viewBox="0 0 22 26"><path d="M3 2l15 11.4-6.4 1.1 3.6 7.2-3.1 1.5-3.6-7.2L3 20z" fill="#121a20" stroke="#fff" stroke-width="1.6" stroke-linejoin="round" /></svg>
	<i class="hw-ring"></i>
</span>
<style>
	.hw-ptr { position: absolute; left: 0; top: 0; z-index: 90; width: 22px; height: 26px; margin: -3px 0 0 -4px; opacity: 0; pointer-events: none; transition: transform 0.6s cubic-bezier(0.22, 0.8, 0.3, 1), opacity 0.3s ease; filter: drop-shadow(0 2px 3px rgba(18, 26, 32, 0.3)); }
	.hw-ptr-on { opacity: 1; }
	.hw-ring { position: absolute; left: 1px; top: 1px; width: 26px; height: 26px; margin: -13px 0 0 -13px; border-radius: 50%; border: 2px solid var(--k-blue-solid, #2563eb); opacity: 0; transform: scale(0.4); }
	.hw-ptr-press .hw-ring { animation: hw-press 0.28s ease-out; }
	@keyframes hw-press { 0% { opacity: 0.9; transform: scale(0.4); } 100% { opacity: 0; transform: scale(1.5); } }
</style>
