<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		goto('/setting/password');
	});
</script>

<div class="flex items-center justify-center h-full">
	<p class="text-gray-500">Loading...</p>
</div>
