<script lang="ts">
	import { onMount } from 'svelte';
	import { Card } from 'flowbite-svelte';
	import { cardStore } from '$lib/Stores/Card';
	import { goto } from '$app/navigation';
	import { VITE_SUPABASE_STORAGE_URL } from '$env/static/public';
	import { Trash } from 'svelte-heros-v2';
	import { _, locale } from 'svelte-i18n';
	import Pagination from '$lib/Components/Pagination.svelte';
	import { page } from '$app/stores';
	import type { ListOption } from '$lib/Models/Common/ListOption';
	import {
		HeadingEnum,
		type InsertHeading,
		type InsertLanguage,
		type Language,
		type UpdateHeading,
		type UpdateLanguage
	} from '$lib/Supabase/Types/database.types';
	import { Tabs, TabItem } from 'flowbite-svelte';
	import { Button, Input } from 'flowbite-svelte';
	import { headingStore } from '$lib/Stores/Heading';
	import { toastStore } from '$lib/Stores/Toast';
	import { languageStore } from '$lib/Stores/Language';
	import { Tooltip } from 'flowbite-svelte';

	let filter: ListOption = {
		page: 1,
		limit: 5,
		language: $locale ?? 'en'
	};
	let titleLanguage = {
		en: '',
		ckb: ''
	};
	let createHeading: UpdateHeading = {
		id: 0,
		title: 0,
		heading_type: HeadingEnum.CARD
	};
	let isLoading = false;
	onMount(async () => {
		await headingStore.fetchByType(HeadingEnum.CARD);
		if ($headingStore) {
			titleLanguage.en = $headingStore.title?.en ?? '';
			titleLanguage.ckb = $headingStore.title?.ckb ?? '';
			createHeading.id = $headingStore.id;
			createHeading.title = $headingStore.title?.id ?? 0;
		}
	});

	let isEditing = false;

	function toggleEdit() {
		isEditing = !isEditing;
	}

	async function saveHeading() {
		isLoading = true;
		let titleResponse: Language | null = null;
		try {
			titleResponse = createHeading.title
				? await languageStore.put({
						...titleLanguage,
						id: createHeading.title
					} as UpdateLanguage)
				: await languageStore.insert(titleLanguage as InsertLanguage);
			createHeading.title = titleResponse.id;
			const response = createHeading.id
				? await headingStore.put({
						...createHeading,
						id: createHeading.id
					} as UpdateHeading)
				: await headingStore.insert(createHeading as InsertHeading);
			if (response && response.id) {
				createHeading = {
					id: response.id,
					title: response.title?.id ?? 0,
					heading_type: HeadingEnum.CARD
				};
				titleLanguage = {
					en: titleLanguage.en,
					ckb: titleLanguage.ckb
				};
			}
		} catch (error) {
			if (titleResponse && titleResponse.id) {
				languageStore.remove(titleResponse.id);
			}
			if (error instanceof Error) {
				toastStore.showToast(error.message, 'error');
			} else {
				toastStore.showToast($_('error-occurred'), 'error');
			}
		} finally {
			isLoading = false;
		}
	}

	onMount(async () => {
		await cardStore.fetchAll(filter);
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

	let previousLocale = $locale;

	$: {
		if (previousLocale !== $locale) {
			previousLocale = $locale;
			filter.language = $locale ?? 'en';
			cardStore.fetchAll(filter);
		}
	}

	function getLanguageData(card: Language | null | undefined) {
		return (card?.[($locale ?? 'en') as keyof Language] ?? $_('no-title')).toString();
	}

	function truncateText(
		text: string,
		maxLength: number = 100
	): { text: string; isTruncated: boolean } {
		if (text.length <= maxLength) return { text, isTruncated: false };
		return { text: text.slice(0, maxLength) + '...', isTruncated: true };
	}
</script>

<div class="mb-8 max-w-2xl mx-auto mt-24">
	<div class="bg-[#f1f1f1] dark:bg-[#212121] rounded-lg p-4">
		<div class="flex justify-between items-center mb-3">
			<h2 class="text-lg font-semibold">{$_('title')}</h2>
			<div class="flex gap-2">
				<Button
					size="xs"
					class="w-16 h-8 {isEditing
						? 'bg-red-500 dark:bg-red-500 hover:bg-red dark:hover:bg-red'
						: 'bg-blue dark:bg-blue hover:bg-blue dark:hover:bg-blue'} focus:ring-0"
					on:click={toggleEdit}
				>
					{isEditing ? $_('cancel') : $_('edit')}
				</Button>
				{#if isEditing}
					<Button size="xs" color="green" on:click={saveHeading}>
						{$_('save')}
					</Button>
				{/if}
			</div>
		</div>

		<Tabs style="pill" class="flex justify-center items-center  rounded-lg p-2">
			<TabItem
				open
				activeClasses="w-24 h-12 text-blue flex justify-center items-center"
				inactiveClasses="w-24 h-12 dark:text-white flex justify-center items-center"
				class="bg-zinc-200 dark:bg-zinc-900 backdrop-blur-sm shadow-sm rounded-lg transition-all duration-200 hover:bg-slate-300 dark:hover:bg-slate-800"
			>
				<div slot="title" class="py-1 px-3">
					<span>{$_('english')}</span>
				</div>
				<div class="py-2" dir="ltr">
					<Input
						type="text"
						dir="ltr"
						class="w-full bg-zinc-300 dark:bg-zinc-900 border-0 px-3 py-2 h-12 rounded-lg
							    text-gray-900 dark:text-white
							   focus:border-transparent
							   transition-all duration-200 ease-in-out
							   placeholder:text-gray-400 dark:placeholder:text-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
						placeholder="Enter English title"
						bind:value={titleLanguage.en}
						disabled={!isEditing}
					/>
				</div>
			</TabItem>

			<TabItem
				activeClasses="w-24 h-12 text-blue flex justify-center items-center"
				inactiveClasses="w-24 h-12 dark:text-white flex justify-center items-center"
				class="bg-zinc-200 dark:bg-zinc-900 backdrop-blur-sm shadow-sm rounded-lg transition-all duration-200 hover:bg-slate-300 dark:hover:bg-slate-800"
			>
				<div slot="title" class="py-1 px-3">
					<span>{$_('kurdish')}</span>
				</div>
				<div class="py-2" dir="rtl">
					<Input
						type="text"
						dir="rtl"
						class="w-full px-3 py-2 rounded-lg h-12
							   bg-zinc-300 dark:bg-zinc-900 border-0 text-gray-900 dark:text-white
							   focus:ring-2 focus:ring-primary focus:border-transparent
							   transition-all duration-200 ease-in-out
							   placeholder:text-gray-400 dark:placeholder:text-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
						placeholder="ناونیشانی کوردی بنووسە"
						bind:value={titleLanguage.ckb}
						disabled={!isEditing}
					/>
				</div>
			</TabItem>
		</Tabs>
	</div>
</div>

<h1 class="text-3xl font-bold mb-6">{$_('cards')}</h1>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
	<Card
		class="cursor-pointer bg-zinc-100 dark:bg-zinc-800 border-0 hover:bg-secondary-light dark:hover:bg-secondary-dark h-[200px]"
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

	{#each $cardStore.data as card}
		<Card
			class="relative overflow-hidden pb-1 hover:scale-105 transition-all duration-300 bg-zinc-100 dark:bg-zinc-800 border-0 h-[200px]"
		>
			<div class="p-5">
				<div class="flex items-start mb-4 gap-2">
					{#if card.icon}
						<img
							src={`${VITE_SUPABASE_STORAGE_URL}${card.icon}`}
							alt="{card.title?.en} icon"
							class="w-12 h-12 mr-4 object-contain"
						/>
					{:else}
						<div class="w-12 h-12 mr-4 bg-gray-200 rounded-full"></div>
					{/if}

					<h5 class=" font-semibold text-gray-900 dark:text-white text-lg">
						{getLanguageData(card.title)}
					</h5>
				</div>

				<div class="relative z-50">
					{#if truncateText(getLanguageData(card.description), 100).isTruncated}
						<p
							class="text-gray-700 dark:text-gray-400 text-sm leading-relaxed line-clamp-3"
							id={`tooltip-${card.id}`}
						>
							{truncateText(getLanguageData(card.description), 100).text}
						</p>
						<Tooltip
							triggeredBy={`#tooltip-${card.id}`}
							placement="bottom"
							class="rounded-lg shadow-md tooltip text-[0.7rem] font-medium bg-slate-900 dark:bg-slate-100 py-2 px-4 text-justify contrast-200 dark:text-black text-white z-50 opacity-90 max-w-sm"
						>
							{getLanguageData(card.description)}
						</Tooltip>
					{:else}
						<p class="text-gray-700 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
							{getLanguageData(card.description)}
						</p>
					{/if}
				</div>
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
					class="w-5 h-5 hover:text-blue"
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
<div class="flex justify-center my-8">
	<Pagination Store={cardStore} currentPage={Number($page.params.page)} name={'cards'} {filter} />
</div>

<style>
	/* Add Tailwind line-clamp utility if not already included */
	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
