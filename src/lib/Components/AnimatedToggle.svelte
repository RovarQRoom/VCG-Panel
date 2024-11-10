<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	type ToggleSize = 'sm' | 'md' | 'lg';
	export let checked = false;
	export let size: ToggleSize = 'md';

	const dispatch = createEventDispatcher();

	const sizes = {
		sm: 'w-24 h-8',
		md: 'w-28 h-9',
		lg: 'w-32 h-10'
	} as const;

	const knobSizes = {
		sm: 'w-7 h-7',
		md: 'w-8 h-8',
		lg: 'w-9 h-9'
	} as const;

	const toggleSize = sizes[size];
	const knobSize = knobSizes[size];

	function handleClick() {
		checked = !checked;
		dispatch('change', { checked });
	}
</script>

<button
	type="button"
	class="relative {toggleSize} group cursor-pointer rounded-full shadow-lg"
	on:click={handleClick}
	aria-checked={checked}
	role="switch"
	style="background: {checked ? '#4CAF50' : '#f5f5f5'}; transition: all 0.3s ease;"
>
	<!-- Background -->
	<div class="absolute inset-0 rounded-full overflow-hidden flex items-center justify-between px-2">
		<!-- Active Text -->
		<span 
			class="text-xs font-medium transition-opacity duration-200 ml-7"
			class:opacity-0={!checked}
			class:opacity-100={checked}
			style="color: white;"
		>
			Active
		</span>
		<!-- Deactive Text -->
		<span 
			class="text-xs font-medium transition-opacity duration-200 mr-7"
			class:opacity-0={checked}
			class:opacity-100={!checked}
			style="color: #666;"
		>
			Deactive
		</span>
	</div>

	<!-- Knob -->
	<div
		class="{knobSize} absolute top-0.5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out"
		class:translate-x-0={!checked}
		class:translate-x-[calc(100%+0.25rem)]={checked}
		style="left: 0.125rem;"
	>
		<span
			class="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
			class:opacity-0={checked}
			style="color: #666;"
		>
			<svg class="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</span>
		<span
			class="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
			class:opacity-0={!checked}
			style="color: #666;"
		>
			<svg class="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
			</svg>
		</span>
	</div>
</button>

<style>
	button {
		-webkit-tap-highlight-color: transparent;
		outline: none !important;
	}

	button:focus-visible {
		@apply ring-2 ring-offset-2 ring-green-500;
	}
</style>
