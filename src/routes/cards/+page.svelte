<script lang="ts">
	import { onMount } from 'svelte';
	import { Card } from 'flowbite-svelte';
	import { cardStore } from '$lib/Stores/Card';
	import { goto } from '$app/navigation';
	import { VITE_SUPABASE_STORAGE_URL } from '$env/static/public';
	import { Trash } from 'svelte-heros-v2';
	import { _ } from 'svelte-i18n';

	onMount(async () => {
		await cardStore.fetchAll();
	});

	function goToAddCard() {
		goto('/cards/add');
	}

	function getRandomColor() {
		return `hsl(${Math.random() * 360}, 70%, 50%)`;
	}

	function deleteCard(id: number) {
		cardStore.remove(id);
	}
</script>

<h1 class="text-3xl font-bold mb-6">{$_('cards')}</h1>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
	<Card
		class="cursor-pointer hover:bg-secondary-light dark:hover:bg-secondary-dark"
		on:click={goToAddCard}
	>
		<div class="flex items-center justify-center h-full">
			<svg
				class="w-12 h-12 text-gray-400"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 6v6m0 0v6m0-6h6m-6 0H6"
				></path>
			</svg>
		</div>
	</Card>

	{#each $cardStore.slice(0, 9) as card}
		<Card
			class="relative overflow-hidden pb-1 hover:scale-105 transition-all duration-300 bg-main-light dark:bg-main-dark"
		>
			<div class="p-5">
				<div class="flex items-start mb-4">
					{#if card.icon}
						<img
							src={`${VITE_SUPABASE_STORAGE_URL}${card.icon}`}
							alt="{card.title?.en} icon"
							class="w-12 h-12 mr-4"
						/>
					{:else}
						<div class="w-12 h-12 mr-4 bg-gray-200 rounded-full"></div>
					{/if}

					<h5 class="text-xl font-semibold text-gray-900 dark:text-white">
						{card.title?.en}
					</h5>
				</div>

				<p class="text-gray-700 dark:text-gray-400 text-sm leading-relaxed">
					{card.description?.en}
				</p>
			</div>

			<div
				class="absolute bottom-0 left-0 right-0 h-1"
				style="background-color: {getRandomColor()};"
			></div>

			<button
				on:click={() => goto(`/cards/edit/${card.id}`)}
				class="absolute top-2 right-10 bg-transparent"
			>
				<svg
					class="w-5 h-5 text-gray-500 hover:text-blue-500"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
					></path>
				</svg>
			</button>

			<button on:click={() => deleteCard(card.id)} class="absolute top-2 right-2 bg-transparent">
				<Trash class="w-5 h-5 text-gray-500 hover:text-red-500" />
			</button>
		</Card>
	{/each}
</div>
