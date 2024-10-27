<script lang="ts">
	import { goto } from '$app/navigation';
	import { Card, Button, Label, Input, Textarea, Tabs, TabItem, Spinner } from 'flowbite-svelte';
	import {
		LanguageEnum,
		type InsertCarousel,
		type Language
	} from '$lib/Supabase/Types/database.types';
	import { _ } from 'svelte-i18n';
	import { languageStore } from '$lib/Stores/Language';
	import { storageStore } from '$lib/Stores/Storage';
	import { carouselStore } from '$lib/Stores/Carousel';
	import { toastStore } from '$lib/Stores/Toast';

	let createCarousel: InsertCarousel = {
		title: 0,
		description: 0,
		media: null
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

	let selectedFile: {
		en: File | null;
		ckb?: File | null;
		ar?: File | null;
	} = {
		en: null
	};

	let imagePreview: {
		en: string | null;
		ckb?: string | null;
		ar?: string | null;
	} = {
		en: null
	};

	let fileType: {
		en: 'image' | 'video' | null;
		ckb?: 'image' | 'video' | null;
		ar?: 'image' | 'video' | null;
	} = {
		en: null
	};

	let isLoading = false;

	function handleFileSelect(event: Event, lang: string) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			if (lang === 'en' || lang === 'ckb' || lang === 'ar') {
				selectedFile[lang] = input.files[0];
				imagePreview[lang] = URL.createObjectURL(input.files[0]);
				fileType[lang] = input.files[0].type.startsWith('image/') ? 'image' : 'video';
			}
		}
	}

	async function handleSubmit() {
		if (isLoading) return;
		isLoading = true;

		let mediaResponse: Language | null = null;
		let mediaFilesResponse: {
			en?: { id: string; path: string; fullPath: string };
			ar?: { id: string; path: string; fullPath: string };
			ckb?: { id: string; path: string; fullPath: string };
		} = {};
		let titleResponse: Language | null = null;
		let descriptionResponse: Language | null = null;
		try {
			titleResponse = await languageStore.insert(titleLanguage);
			descriptionResponse = await languageStore.insert(descriptionLanguage);
			if (selectedFile.en && selectedFile.en.size > 0) {
				const response = await storageStore.uploadFileWithLanguage(selectedFile.en, 'en');
				mediaFilesResponse.en = {
					id: response.en.id,
					path: response.en.path,
					fullPath: response.en.fullPath
				};
			}
			if (selectedFile.ar && selectedFile.ar.size > 0) {
				const response = await storageStore.uploadFileWithLanguage(selectedFile.ar, 'ar');
				mediaFilesResponse.ar = {
					id: response.ar.id,
					path: response.ar.path,
					fullPath: response.ar.fullPath
				};
			}
			if (selectedFile.ckb && selectedFile.ckb.size > 0) {
				const response = await storageStore.uploadFileWithLanguage(selectedFile.ckb, 'ckb');
				mediaFilesResponse.ckb = {
					id: response.ckb.id,
					path: response.ckb.path,
					fullPath: response.ckb.fullPath
				};
			}
			mediaResponse = await languageStore.insert({
				en: mediaFilesResponse.en?.fullPath ?? '',
				ar: mediaFilesResponse.ar?.fullPath ?? '',
				ckb: mediaFilesResponse.ckb?.fullPath ?? ''
			});
			createCarousel.title = titleResponse.id;
			createCarousel.description = descriptionResponse.id;
			createCarousel.media = mediaResponse.id;
			const response = await carouselStore.insert(createCarousel);
			if (response && response.id) {
				toastStore.showToast('Carousel added successfully!', 'success');
				goto('/carousels/1');
			}
		} catch (error) {
			console.error(error);
			if (titleResponse && titleResponse.id) {
				await languageStore.remove(titleResponse.id);
			}
			if (descriptionResponse && descriptionResponse.id) {
				await languageStore.remove(descriptionResponse.id);
			}
			if (mediaResponse && mediaResponse.id) {
				await languageStore.remove(mediaResponse.id);
			}
			if (mediaFilesResponse.en && mediaFilesResponse.en.id) {
				await storageStore.removeFile(mediaFilesResponse.en.id);
			}
			if (mediaFilesResponse.ar && mediaFilesResponse.ar.id) {
				await storageStore.removeFile(mediaFilesResponse.ar.id);
			}
			if (mediaFilesResponse.ckb && mediaFilesResponse.ckb.id) {
				await storageStore.removeFile(mediaFilesResponse.ckb.id);
			}
			if (error instanceof Error) {
				toastStore.showToast(error.message, 'error');
			} else {
				toastStore.showToast($_('unknown-error-occurred'), 'error');
			}
		} finally {
			isLoading = false;
		}
	}

	function goBack() {
		goto('/carousels/1');
	}
</script>

<div class="mb-6">
	<Button color="light" on:click={goBack} class="px-4 py-2 dark:bg-input-dark border-0 m-4">
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

<h1 class="text-3xl font-bold mb-6">{$_('add-new-carousel')}</h1>

<Card class="max-w-2xl mx-auto p-6 bg-white dark:bg-main-dark shadow-lg rounded-lg">
	<form on:submit|preventDefault={handleSubmit} class="flex flex-col space-y-6">
		<Tabs style="pills" class="justify-center mb-6">
			{#each Object.keys(LanguageEnum) as key}
				<TabItem open title={$_(key.toLowerCase())}>
					<div class="mt-4">
						<Label for="title-{key.toLowerCase()}" class="mb-2">
							{$_('title')} ({$_(key.toLowerCase())})
						</Label>
						<Input
						class="bg-input-light dark:bg-input-dark border-0"
							type="text"
							id="title-{key.toLowerCase()}"
							placeholder={$_('enter-title')}
							bind:value={titleLanguage[
								key === 'ENGLISH' ? 'en' : key === 'KURDISH' ? 'ckb' : 'ar'
							]}
							required
						/>
					</div>
					<div class="mt-4">
						<Label for="description-{key.toLowerCase()}" class="mb-2">
							{$_('description')} ({$_(key.toLowerCase())})
						</Label>
						<Textarea
						class="bg-input-light dark:bg-input-dark border-0"
							id="description-{key.toLowerCase()}"
							placeholder={$_('enter-description')}
							bind:value={descriptionLanguage[
								key === 'ENGLISH' ? 'en' : key === 'KURDISH' ? 'ckb' : 'ar'
							]}
							required
						/>
					</div>
					<div class="mt-4">
						<Label for="media-{key.toLowerCase()}" class="mb-2"
							>{$_('media')} ({$_(key.toLowerCase())})</Label
						>
						<Input
						class="bg-input-light dark:bg-input-dark border-0"
							type="file"
							id="media-{key.toLowerCase()}"
							accept="image/*,video/*"
							on:change={(event) =>
								handleFileSelect(
									event,
									key === 'ENGLISH' ? 'en' : key === 'KURDISH' ? 'ckb' : 'ar'
								)}
						/>
						<div class="mt-2 h-64 flex items-center justify-center overflow-hidden">
							{#if imagePreview[key === 'ENGLISH' ? 'en' : key === 'KURDISH' ? 'ckb' : 'ar']}
								{#if fileType[key === 'ENGLISH' ? 'en' : key === 'KURDISH' ? 'ckb' : 'ar'] === 'image'}
									<img
										src={imagePreview[key === 'ENGLISH' ? 'en' : key === 'KURDISH' ? 'ckb' : 'ar']}
										alt="Selected media"
										class="w-full h-full object-cover"
									/>
								{:else if fileType[key === 'ENGLISH' ? 'en' : key === 'KURDISH' ? 'ckb' : 'ar'] === 'video'}
									<!-- svelte-ignore a11y-media-has-caption -->
									<video
										src={imagePreview[key === 'ENGLISH' ? 'en' : key === 'KURDISH' ? 'ckb' : 'ar']}
										controls
										class="w-full h-full object-contain"
									>
										{$_('your-browser-does-not-support-the-video-tag')}
									</video>
								{/if}
							{:else}
								<p class="text-gray-400">{$_('no-media-selected')}</p>
							{/if}
						</div>
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
				{$_('add-carousel')}
			</Button>
		</div>
	</form>
</Card>
