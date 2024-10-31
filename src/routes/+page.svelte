<script lang="ts">
	import { onMount } from 'svelte';
	import { cardStore } from '$lib/Stores/Card';
	import { eventStore } from '$lib/Stores/Event';
	import { authStore } from '$lib/Stores/Authentication';

	let totalCards = 0;
	let totalEvents = 0;
	let userName = '';

	onMount(async () => {
		await cardStore.fetchAll();
		await eventStore.fetchAll();
		totalCards = $cardStore.total;
		totalEvents = 0;
		userName = $authStore?.email || 'User';
	});
</script>

<div class="p-4 mt-24">
	<div class="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
			<div
				class="flex items-center justify-center h-24 rounded bg-blue text-white dark:bg-darkBlue"
			>
				<p class="text-2xl text-gray-400 dark:text-gray-500">
					<span class="font-semibold text-gray-900 dark:text-white">{totalCards}</span> Cards
				</p>
			</div>
			<div
				class="flex items-center justify-center h-24 rounded bg-blue text-white dark:bg-darkBlue"
			>
				<p class="text-2xl text-gray-400 dark:text-gray-500">
					<span class="font-semibold text-gray-900 dark:text-white">{totalEvents}</span> Events
				</p>
			</div>
			<div
				class="flex items-center justify-center h-24 rounded bg-blue text-white dark:bg-darkBlue"
			>
				<p class="text-2xl text-gray-400 dark:text-gray-500">
					Welcome, <span class="font-semibold text-gray-900 dark:text-white">{userName}</span>
				</p>
			</div>
		</div>
		<div
			class="flex items-center justify-center h-48 mb-4 rounded bg-blue text-white dark:bg-darkBlue"
		>
			<p class="text-2xl text-gray-400 dark:text-gray-500">Quick Actions</p>
		</div>
		<div class="grid grid-cols-2 gap-4 mb-4">
			<div
				class="flex items-center justify-center rounded bg-blue text-white h-28 dark:bg-darkBlue"
			>
				<a href="/cards" class="text-xl text-blue-600 dark:text-blue-500 hover:underline"
					>Manage Cards</a
				>
			</div>
			<div
				class="flex items-center justify-center rounded bg-blue text-white h-28 dark:bg-darkBlue"
			>
				<a href="/event" class="text-xl text-blue-600 dark:text-blue-500 hover:underline"
					>Manage Events</a
				>
			</div>
		</div>
		<div
			class="flex items-center justify-center h-48 mb-4 rounded bg-blue text-white dark:bg-darkBlue"
		>
			<p class="text-2xl text-gray-400 dark:text-gray-500">Recent Activity</p>
		</div>
	</div>
</div>
