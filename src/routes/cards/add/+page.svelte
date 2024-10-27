<script lang="ts">
	import { Card, Button, Label, Input, Textarea, Tabs, TabItem, Spinner } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { LanguageEnum, type InsertCard, type Language } from '$lib/Supabase/Types/database.types';
	import { _ } from 'svelte-i18n';
	import { languageStore } from '$lib/Stores/Language';
	import { storageStore } from '$lib/Stores/Storage';
	import { cardStore } from '$lib/Stores/Card';
	import { toastStore } from '$lib/Stores/Toast';

	let createCard: InsertCard = {
		icon: '',
		title: 0,
		description: 0,
		link: '' // Add this line
	};
	let titleLanguage: {
		en: string;
		ckb?: string;
		ar?: string;
	} = {
		en: ''
	};
	let descriptionLanguage: {
		en: string;
		ckb?: string;
		ar?: string;
	} = {
		en: ''
	};

	let selectedFile: File | null = null;
	let imagePreview: string | null = null;

	let isLoading = false;

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			selectedFile = input.files[0];
			imagePreview = URL.createObjectURL(selectedFile);
		}
	}

	async function handleSubmit() {
		if (isLoading) return;
		isLoading = true;

		let titleResponse: Language | null = null;
		let descriptionResponse: Language | null = null;
		let iconResponse: {
			id: string;
			path: string;
			fullPath: string;
		} | null = null;
		try {
			titleResponse = await languageStore.insert(titleLanguage);
			descriptionResponse = await languageStore.insert(descriptionLanguage);
			if (selectedFile && selectedFile.size > 0) {
				iconResponse = await storageStore.uploadFile(selectedFile);
			}
			createCard.icon = iconResponse?.fullPath ?? null;
			createCard.title = titleResponse.id;
			createCard.description = descriptionResponse.id;
			await cardStore.insert(createCard);
			toastStore.showToast('Card added successfully!', 'success');
			goto('/cards/1');
		} catch (error) {
			console.error(error);
			if (titleResponse && titleResponse.id) {
				await languageStore.remove(titleResponse.id);
			}
			if (descriptionResponse && descriptionResponse.id) {
				await languageStore.remove(descriptionResponse.id);
			}
			if (iconResponse && iconResponse.id) {
				await storageStore.deleteFile(iconResponse.id);
			}
			if (error instanceof Error) {
				toastStore.showToast(error.message, 'error');
			} else {
				toastStore.showToast('An unknown error occurred', 'error');
			}
		} finally {
			isLoading = false;
		}
	}

	function goBack() {
		goto('/cards/1');
	}
</script>

<!-- Add the back button at the top -->
<div class="mb-6">
	<Button color="light" on:click={goBack} class="px-4 py-2 bg-input-light dark:bg-input-dark border-0 m-4">
		<svg
			class="w-4 h-4 mr-2"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M10 19l-7-7m0 0l7-7m-7 7h18"
			></path>
		</svg>
		{$_('back')}
	</Button>
</div>

<h1 class="text-3xl font-bold mb-6">{$_('add-new-card')}</h1>

<Card class="max-w-2xl mx-auto p-6 bg-white dark:bg-main-dark shadow-lg rounded-lg">
	<form on:submit|preventDefault={handleSubmit} class="flex flex-col space-y-6">
		<div>
			<Label for="link" class="mb-2">{$_('link')}</Label>
			<Input type="url" class="bg-input-light dark:bg-input-dark border-0" id="link" placeholder="Enter card link" bind:value={createCard.link} />
		</div>

		<div>
			<Label for="icon" class="mb-2">{$_('icon')}</Label>
			<Input type="file" class="bg-input-light dark:bg-input-dark border-0" id="icon" accept="image/*" on:change={handleFileSelect} />
			<div class="mt-2 h-48 flex items-center justify-center overflow-hidden">
				{#if imagePreview}
					<img
						src={imagePreview}
						alt="Selected icon"
						class="max-w-full max-h-full object-contain"
					/>
				{:else}
					<p class="text-gray-400">{$_('no-image-selected')}</p>
				{/if}
			</div>
		</div>

		<Tabs style="pills" class="justify-center mb-6">
			{#each Object.keys(LanguageEnum) as key}
				<TabItem open title={$_(key.toLowerCase())}>
					<div class="mt-4">
						<Label for="title-en" class="mb-2">{$_('title')} ({$_(key.toLowerCase())})</Label>
						<Input
						class="bg-input-light dark:bg-input-dark border-0"
							type="text"
							id="title-en"
							placeholder="Enter card title"
							bind:value={titleLanguage[
								key === 'ENGLISH'
									? 'en'
									: key === 'KURDISH'
										? 'ckb'
										: key === 'ARABIC'
											? 'ar'
											: 'en'
							]}
							required
						/>
					</div>
					<div class="mt-4">
						<Label for="description-en" class="mb-2"
							>{$_('description')} ({$_(key.toLowerCase())})</Label
						>
						<Textarea
						class="bg-input-light dark:bg-input-dark border-0"
							id="description-en"
							placeholder="Enter card description"
							bind:value={descriptionLanguage[
								key === 'ENGLISH'
									? 'en'
									: key === 'KURDISH'
										? 'ckb'
										: key === 'ARABIC'
											? 'ar'
											: 'en'
							]}
							required
						/>
					</div>
				</TabItem>
			{/each}
		</Tabs>

		<div class="flex justify-end">
			<Button
				type="submit"
				class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300 ease-in-out"
				disabled={isLoading}
			>
				{#if isLoading}
					<Spinner class="mr-3" size="4" color="white" />
				{/if}
				{$_('add-card')}
			</Button>
		</div>
	</form>
</Card>
