<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { carouselStore } from '$lib/Stores/Carousel';
	import { VITE_SUPABASE_STORAGE_URL } from '$env/static/public';
	import { scale } from 'svelte/transition';
	import { PlusOutline } from 'flowbite-svelte-icons';
	import { isVideoFile, isVideoLink } from '$lib/utils/fileUtils';
	import { _ } from 'svelte-i18n';
	import Pagination from '$lib/Components/Pagination.svelte';
	import { page } from '$app/stores';
	import type { ListOption } from '$lib/Models/Common/ListOption';
	let filter: ListOption = {
		page: 1,
		limit: 6
	};

	onMount(async () => {
		await carouselStore.fetchAll(filter);
	});

	function handleEdit(id: number) {
		goto(`/carousels/edit/${id}`);
	}

	async function handleDelete(id: number) {
		await carouselStore.remove(id);
	}
</script>

<div class="container mx-auto p-4">
	<h1 class="text-2xl font-bold mb-4">{$_('carousels')}</h1>

	<a
		href="/carousels/add"
		class="bg-input-light dark:bg-input-dark hover:bg-blue duration-300 ease-in-out  w-12 h-12 rounded-full items-center justify-center mb-4 flex"
	>
		<PlusOutline class="w-8 h-8" strokeWidth="2" />
	</a>

	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
		{#each $carouselStore.data as carousel}
			<div
				class="relative overflow-hidden rounded-xl shadow-lg group transition-transform duration-300 hover:scale-105"
			>
				{#if isVideoFile(carousel.media?.en) || isVideoLink(carousel.media?.en ?? '')}
					<div class="relative">
						<!-- svelte-ignore a11y-media-has-caption -->
						<video
							src={`${VITE_SUPABASE_STORAGE_URL}${carousel.media?.en}`}
							class="w-full h-64 object-cover"
							autoplay
							muted
						>
							{$_('your-browser-does-not-support-the-video-tag')}
						</video>
						<div class="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 inline-block mr-1"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"
								/>
							</svg>
							{$_('video')}
						</div>
					</div>
				{:else}
					<img
						src={`${VITE_SUPABASE_STORAGE_URL}${carousel.media?.en}`}
						alt={carousel.title?.en}
						class="w-full h-64 object-cover"
					/>
				{/if}
				<div
					class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4"
				>
					<h2 class="text-xl font-semibold text-white mb-2">{carousel.title?.en}</h2>
					<div class="flex justify-end space-x-2">
						<button
							on:click={() => handleEdit(carousel.id)}
							class="text-white hover:text-blue-300 transition-colors duration-300"
							transition:scale
						>
							<svg
								class="w-5 h-5"
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
						<button
							on:click={() => handleDelete(carousel.id)}
							class="text-white hover:text-red-300 transition-colors duration-300"
							transition:scale
						>
							<svg
								class="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
								></path>
							</svg>
						</button>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<div class="flex justify-center mt-8">
		<Pagination
			Store={carouselStore}
			currentPage={Number($page.params.page)}
			name={'carousels'}
			{filter}
		/>
	</div>
</div>
