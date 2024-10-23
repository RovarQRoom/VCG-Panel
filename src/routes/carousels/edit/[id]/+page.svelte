<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Card, Button, Label, Input, Textarea, Tabs, TabItem, Spinner } from 'flowbite-svelte';
	import {
		LanguageEnum,
		type UpdateCarousel,
		type Language
	} from '$lib/Supabase/Types/database.types';
	import { _ } from 'svelte-i18n';
	import { languageStore } from '$lib/Stores/Language';
	import { storageStore } from '$lib/Stores/Storage';
	import { carouselStore } from '$lib/Stores/Carousel';
	import { page } from '$app/stores';
	import { VITE_SUPABASE_STORAGE_URL } from '$env/static/public';
	import { isVideoFile } from '$lib/utils/fileUtils';
	import { toastStore } from '$lib/Stores/Toast';

	let carousel: UpdateCarousel | null = null;
	let titleLanguage: { en: string; ckb?: string; ar?: string } = { en: '' };
	let descriptionLanguage: { en: string; ckb?: string; ar?: string } = { en: '' };

	let selectedFile: { en: File | null; ckb?: File | null; ar?: File | null } = { en: null };
	let imagePreview: { en: string | null; ckb?: string | null; ar?: string | null } = { en: null };

	let isLoading = false;

	onMount(async () => {
		const response = await carouselStore.fetch(Number($page.params.id));
		carousel = {
			title: response.title?.id,
			description: response.description?.id,
			media: response.media?.id,
			id: response.id
		};
		titleLanguage = {
			en: response.title?.en ?? '',
			ckb: response.title?.ckb ?? '',
			ar: response.title?.ar ?? ''
		};
		descriptionLanguage = {
			en: response.description?.en ?? '',
			ckb: response.description?.ckb ?? '',
			ar: response.description?.ar ?? ''
		};
		imagePreview = {
			en: response.media?.en ? `${VITE_SUPABASE_STORAGE_URL}${response.media.en}` : null,
			ckb: response.media?.ckb ? `${VITE_SUPABASE_STORAGE_URL}${response.media.ckb}` : null,
			ar: response.media?.ar ? `${VITE_SUPABASE_STORAGE_URL}${response.media.ar}` : null
		};
	});

	function handleFileSelect(event: Event, lang: string) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			if (lang === 'en' || lang === 'ckb' || lang === 'ar') {
				selectedFile[lang] = input.files[0];
				imagePreview[lang] = URL.createObjectURL(input.files[0]);
			}
		}
	}

	async function handleUpdate() {
		if (!carousel || isLoading) return;
		isLoading = true;

		let mediaResponse: Language | null = null;
		let mediaFilesResponse: {
			en?: { id: string; path: string; fullPath: string };
			ar?: { id: string; path: string; fullPath: string };
			ckb?: { id: string; path: string; fullPath: string };
		} = {};
		let titleResponse: Language | null = null;
		let descriptionResponse: Language | null = null;
		let oldMedia = carousel.media;

		try {
			titleResponse = await languageStore.put({
				...titleLanguage,
				id: carousel.title
			});
			descriptionResponse = await languageStore.put({
				...descriptionLanguage,
				id: carousel.description ?? 0
			});

			if (oldMedia) {
				const existingMediaPaths = await languageStore.fetch(oldMedia);
				mediaResponse = { ...existingMediaPaths, id: oldMedia };
			}

			for (const lang of ['en', 'ar', 'ckb'] as const) {
				if (selectedFile[lang] && selectedFile[lang]!.size > 0) {
					const response = await storageStore.uploadFileWithLanguage(selectedFile[lang]!, lang);
					mediaFilesResponse[lang] = {
						id: response[lang].id,
						path: response[lang].path,
						fullPath: response[lang].fullPath
					};
					if (mediaResponse) {
						mediaResponse[lang] = response[lang].fullPath;
					}
				}
			}

			if (Object.keys(mediaFilesResponse).length > 0) {
				mediaResponse = await languageStore.put(
					mediaResponse ?? {
						id: carousel.media ?? 0,
						en: mediaFilesResponse.en?.fullPath ?? imagePreview.en ?? '',
						ar: mediaFilesResponse.ar?.fullPath ?? imagePreview.ar ?? '',
						ckb: mediaFilesResponse.ckb?.fullPath ?? imagePreview.ckb ?? ''
					}
				);
			}

			const updatedCarousel: UpdateCarousel = {
				...carousel,
				title: titleResponse?.id ?? carousel.title,
				description: descriptionResponse?.id ?? carousel.description,
				media: mediaResponse?.id ?? carousel.media
			};

			await carouselStore.put(updatedCarousel);

			// Delete old media files if they were replaced
			if (oldMedia && mediaResponse) {
				const oldMediaPaths = await languageStore.fetch(oldMedia);

				for (const lang of ['en', 'ar', 'ckb'] as const) {
					if (oldMediaPaths[lang] && oldMediaPaths[lang] !== mediaResponse[lang]) {
						const filePathToDelete = oldMediaPaths[lang].replace(VITE_SUPABASE_STORAGE_URL, '');
						await storageStore.deleteFile(filePathToDelete);
					}
				}
			}

			goto('/carousels/1');
		} catch (error) {
			console.error(error);

			// Revert changes if an error occurs
			if (titleResponse && titleResponse.id) {
				await languageStore.put(titleLanguage);
			}
			if (descriptionResponse && descriptionResponse.id) {
				await languageStore.put(descriptionLanguage);
			}
			if (mediaResponse && mediaResponse.id) {
				await languageStore.put({ id: oldMedia ?? 0 });
			}
			for (const lang in mediaFilesResponse) {
				if (mediaFilesResponse[lang as keyof typeof mediaFilesResponse]) {
					await storageStore.deleteFile(
						mediaFilesResponse[lang as keyof typeof mediaFilesResponse]!.id
					);
				}
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
		goto('/carousels/1');
	}

	function isVideoLink(link: string): boolean {
		const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
		return videoExtensions.some((ext) => link.toLowerCase().endsWith(ext));
	}
</script>

<div class="mb-6">
	<Button color="light" on:click={goBack} class="px-4 py-2">
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

<h1 class="text-3xl font-bold mb-6">{$_('edit-carousel')}</h1>

<Card class="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
	<form on:submit|preventDefault={handleUpdate} class="flex flex-col space-y-6">
		<Tabs style="pills" class="justify-center mb-6">
			{#each Object.keys(LanguageEnum) as key}
				<TabItem open title={$_(key.toLowerCase())}>
					<div class="mt-4">
						<Label for="title-{key.toLowerCase()}" class="mb-2">
							{$_('title')} ({$_(key.toLowerCase())})
						</Label>
						<Input
							type="text"
							id="title-{key.toLowerCase()}"
							placeholder={$_('enter-title')}
							bind:value={titleLanguage[
								key === 'ENGLISH' ? 'en' : key === 'KURDISH' ? 'ckb' : 'ar'
							]}
							required={key === 'ENGLISH'}
						/>
					</div>
					<div class="mt-4">
						<Label for="description-{key.toLowerCase()}" class="mb-2">
							{$_('description')} ({$_(key.toLowerCase())})
						</Label>
						<Textarea
							id="description-{key.toLowerCase()}"
							placeholder={$_('enter-description')}
							bind:value={descriptionLanguage[
								key === 'ENGLISH' ? 'en' : key === 'KURDISH' ? 'ckb' : 'ar'
							]}
							required={key === 'ENGLISH'}
						/>
					</div>
					<div class="mt-4">
						<Label for="media-{key.toLowerCase()}" class="mb-2">
							{$_('media')} ({$_(key.toLowerCase())})
						</Label>
						<Input
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
								{#if isVideoFile(selectedFile[key === 'ENGLISH' ? 'en' : key === 'KURDISH' ? 'ckb' : 'ar']?.name) || isVideoLink(imagePreview[key === 'ENGLISH' ? 'en' : key === 'KURDISH' ? 'ckb' : 'ar'] ?? '')}
									<!-- svelte-ignore a11y-media-has-caption -->
									<video
										src={imagePreview[key === 'ENGLISH' ? 'en' : key === 'KURDISH' ? 'ckb' : 'ar']}
										controls
										class="w-full h-full object-contain"
									>
										{$_('your-browser-does-not-support-the-video-tag')}
									</video>
								{:else}
									<img
										src={imagePreview[key === 'ENGLISH' ? 'en' : key === 'KURDISH' ? 'ckb' : 'ar']}
										alt="Selected media"
										class="w-full h-full object-cover"
									/>
								{/if}
							{:else}
								<p class="text-gray-400">{$_('no-image-selected')}</p>
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
				{$_('update-carousel')}
			</Button>
		</div>
	</form>
</Card>
