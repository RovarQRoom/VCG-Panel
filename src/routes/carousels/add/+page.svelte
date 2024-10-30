<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		Card,
		Button,
		Label,
		Input,
		Textarea,
		Tabs,
		TabItem,
		Spinner,
		Img
	} from 'flowbite-svelte';
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
	// @ts-ignore
	import ProgressBar from 'svelte-progress-bar';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	let createCarousel: InsertCarousel = {
		title: 0,
		description: 0,
		media: null,
		thumbnail_video: null
	};
	let progressLoading = writable(0);

	let titleLanguage: {
		en?: string;
		ckb?: string;
		ar?: string;
	} = {
		en: ''
	};

	let descriptionLanguage: {
		en?: string;
		ckb?: string;
		ar?: string;
	} = {
		en: ''
	};

	let selectedFile: {
		en?: File | null;
		ckb?: File | null;
		ar?: File | null;
	} = {
		en: null
	};

	let mediaUrl: {
		en?: string;
		ckb?: string;
		ar?: string;
	} = {
		en: ''
	};

	let imagePreview: {
		en?: string | null;
		ckb?: string | null;
		ar?: string | null;
	} = {
		en: null
	};

	let fileType: {
		en?: 'image' | 'video' | null;
		ckb?: 'image' | 'video' | null;
		ar?: 'image' | 'video' | null;
	} = {
		en: null
	};

	let isLoading = false;
	let progress: any;

	onMount(() => {
		progress.setWidthRatio(0);
	});

	function handleFileSelect(event: Event, lang: string) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			if (lang === 'en' || lang === 'ckb' || lang === 'ar') {
				selectedFile[lang] = input.files[0];
				imagePreview[lang] = URL.createObjectURL(input.files[0]);
				fileType[lang] = input.files[0].type.startsWith('image/') ? 'image' : 'video';
				// Clear URL input when file is selected
				mediaUrl[lang] = '';
			}
		}
	}

	function getYouTubeVideoId(url: string): string | null {
		const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
		const match = url.match(regExp);
		return match && match[2].length === 11 ? match[2] : null;
	}

	function getVimeoVideoId(url: string): string | null {
		const regExp = /vimeo\.com\/(?:.*#|.*\/videos\/)?([0-9]+)/;
		const match = url.match(regExp);
		return match ? match[1] : null;
	}

	function isVideoUrl(url: string): boolean {
		return (
			url.includes('youtube.com') ||
			url.includes('youtu.be') ||
			url.includes('vimeo.com') ||
			url.endsWith('.mp4')
		);
	}

	function getEmbedUrl(url: string | null | undefined): string | null {
		if (!url) return null;
		const youtubeId = getYouTubeVideoId(url);
		if (youtubeId) {
			return `https://www.youtube.com/embed/${youtubeId}`;
		}

		const vimeoId = getVimeoVideoId(url);
		if (vimeoId) {
			return `https://player.vimeo.com/video/${vimeoId}`;
		}

		return null;
	}

	function handleUrlInput(event: Event, lang: string) {
		const input = event.target as HTMLInputElement;
		if (lang === 'en' || lang === 'ckb' || lang === 'ar') {
			mediaUrl[lang] = input.value;
			// Clear file input and preview when URL is entered
			if (input.value) {
				clearFileInput(lang);
				// Determine if URL is video or image
				fileType[lang] = isVideoUrl(input.value) ? 'video' : 'image';
				imagePreview[lang] = input.value;
			} else {
				imagePreview[lang] = null;
				fileType[lang] = null;
			}
		}
	}

	function clearFileInput(lang: string) {
		if (lang === 'en' || lang === 'ckb' || lang === 'ar') {
			selectedFile[lang] = null;
			if (imagePreview[lang]) {
				URL.revokeObjectURL(imagePreview[lang]);
			}
			imagePreview[lang] = null;
			fileType[lang] = null;
			// Reset the file input element
			const fileInput = document.getElementById(`media-${lang}`) as HTMLInputElement;
			if (fileInput) {
				fileInput.value = '';
			}
		}
	}

	let thumbnail: {
		file: File | null;
		preview: string | null;
	} = {
		file: null,
		preview: null
	};

	function handleThumbnailSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			thumbnail.file = input.files[0];
			thumbnail.preview = URL.createObjectURL(input.files[0]);
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
		let thumbnailResponse: {
			id: string;
			path: string;
			fullPath: string;
		} | null = null;
		console.log('progress', progress.getState().width);
		try {
			titleResponse = await languageStore.insert(titleLanguage as Language);
			descriptionResponse = await languageStore.insert(descriptionLanguage as Language);

			const progress1 = Number((Math.random() * (0.2 - 0.1) + 0.1).toFixed(2));
			progress.setWidthRatio(progress1);
			progressLoading.set(progress1 * 100);

			// Handle both file uploads and URLs
			const mediaUrls = {
				en:
					mediaUrl.en ||
					(selectedFile.en
						? await storageStore
								.uploadFileWithLanguage(selectedFile.en, 'en')
								.then((r) => r.en.fullPath)
						: ''),
				ckb:
					mediaUrl.ckb ||
					(selectedFile.ckb
						? await storageStore
								.uploadFileWithLanguage(selectedFile.ckb, 'ckb')
								.then((r) => r.ckb.fullPath)
						: '')
			};

			const progress2 = Number((Math.random() * (0.6 - 0.5) + 0.5).toFixed(2));
			progress.setWidthRatio(progress2);
			progressLoading.set(progress2 * 100);

			if (thumbnail.file && thumbnail.file.size > 0) {
				thumbnailResponse = await storageStore.uploadFile(thumbnail.file);
			}

			const progress3 = Number((Math.random() * (0.7 - 0.6) + 0.6).toFixed(2));
			progress.setWidthRatio(progress3);
			progressLoading.set(progress3 * 100);

			mediaResponse = await languageStore.insert(mediaUrls as Language);

			const progress4 = Number((Math.random() * (0.8 - 0.7) + 0.7).toFixed(2));
			progress.setWidthRatio(progress4);
			progressLoading.set(progress4 * 100);

			createCarousel.title = titleResponse.id;
			createCarousel.description = descriptionResponse.id;
			createCarousel.media = mediaResponse.id;
			createCarousel.thumbnail_video = thumbnailResponse?.fullPath ?? null;
			const response = await carouselStore.insert(createCarousel);

			const progress5 = Number((Math.random() * (0.95 - 0.85) + 0.85).toFixed(2));
			progress.setWidthRatio(progress5);
			progressLoading.set(progress5 * 100);

			progress.setWidthRatio(1);
			progressLoading.set(100);

			if (response && response.id) {
				toastStore.showToast('Carousel added successfully!', 'success');
				goto('/carousels/1');
			}
		} catch (error) {
			// Cleanup logic remains the same
			if (titleResponse && titleResponse.id) {
				await languageStore.remove(titleResponse.id);
			}
			if (descriptionResponse && descriptionResponse.id) {
				await languageStore.remove(descriptionResponse.id);
			}
			if (mediaResponse && mediaResponse.id) {
				await languageStore.remove(mediaResponse.id);
			}
			if (thumbnailResponse && thumbnailResponse.id) {
				await storageStore.removeFile(thumbnailResponse.id);
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
			progress.setWidthRatio(0);
			progressLoading.set(0);
		}
	}

	function goBack() {
		goto('/carousels/1');
	}
</script>

<ProgressBar bind:this={progress} color="#f17f18" />

<div class="mb-6">
	<Button
		color="light"
		on:click={goBack}
		class="px-4 py-2 dark:bg-input-dark border-0 m-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
	>
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
		{#if Object.values(fileType).some((type) => type === 'video')}
			<div class="mb-4">
				<Label for="thumbnail" class="mb-2">
					{$_('thumbnail')}
				</Label>
				<Input
					class="bg-input-light dark:bg-input-dark border-0"
					type="file"
					id="thumbnail"
					accept="image/*"
					on:change={handleThumbnailSelect}
				/>
				{#if thumbnail.preview}
					<div class="mt-2 h-48">
						<Img
							src={thumbnail.preview}
							alt="Video thumbnail"
							class="w-full h-48 object-cover rounded"
						/>
					</div>
				{/if}
			</div>
		{/if}
		<Tabs style="pills" class="justify-center mb-6">
			{#each Object.keys(LanguageEnum).filter((key) => key !== 'ARABIC') as key}
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
						<Label for="media-url-{key.toLowerCase()}" class="mb-2">
							{$_('media-url')} ({$_(key.toLowerCase())})
						</Label>
						<div class="relative">
							<Input
								class="bg-input-light dark:bg-input-dark border-0 mb-4 pr-10"
								type="url"
								id="media-url-{key.toLowerCase()}"
								placeholder="Enter media URL"
								value={mediaUrl[key === 'ENGLISH' ? 'en' : key === 'KURDISH' ? 'ckb' : 'ar']}
								on:input={(event) =>
									handleUrlInput(
										event,
										key === 'ENGLISH' ? 'en' : key === 'KURDISH' ? 'ckb' : 'ar'
									)}
								disabled={!!selectedFile[
									key === 'ENGLISH' ? 'en' : key === 'KURDISH' ? 'ckb' : 'ar'
								]}
							/>
							{#if mediaUrl[key === 'ENGLISH' ? 'en' : key === 'KURDISH' ? 'ckb' : 'ar']}
								<button
									type="button"
									class="relative right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
									on:click={() => {
										const lang = key === 'ENGLISH' ? 'en' : key === 'KURDISH' ? 'ckb' : 'ar';
										mediaUrl[lang] = '';
										imagePreview[lang] = null;
										fileType[lang] = null;
									}}
								>
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							{/if}
						</div>

						<Label for="media-{key.toLowerCase()}" class="mb-2">
							{$_('media-upload')} ({$_(key.toLowerCase())})
						</Label>
						<div class="relative">
							<Input
								class="bg-input-light dark:bg-input-dark border-0 pr-10"
								type="file"
								id="media-{key.toLowerCase()}"
								accept="image/*,video/*"
								on:change={(event) =>
									handleFileSelect(
										event,
										key === 'ENGLISH' ? 'en' : key === 'KURDISH' ? 'ckb' : 'ar'
									)}
								disabled={!!mediaUrl[key === 'ENGLISH' ? 'en' : key === 'KURDISH' ? 'ckb' : 'ar']}
							/>
							{#if selectedFile[key === 'ENGLISH' ? 'en' : key === 'KURDISH' ? 'ckb' : 'ar']}
								<button
									type="button"
									class="relative right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
									on:click={() =>
										clearFileInput(key === 'ENGLISH' ? 'en' : key === 'KURDISH' ? 'ckb' : 'ar')}
								>
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							{/if}
						</div>

						<div class="mt-2 h-64 flex items-center justify-center overflow-hidden">
							{#if imagePreview[key === 'ENGLISH' ? 'en' : key === 'KURDISH' ? 'ckb' : 'ar']}
								{#if fileType[key === 'ENGLISH' ? 'en' : key === 'KURDISH' ? 'ckb' : 'ar'] === 'image'}
									<img
										src={imagePreview[key === 'ENGLISH' ? 'en' : key === 'KURDISH' ? 'ckb' : 'ar']}
										alt="Selected media"
										class="w-full h-full object-cover"
									/>
								{:else if mediaUrl[key === 'ENGLISH' ? 'en' : key === 'KURDISH' ? 'ckb' : 'ar']}
									{#if getEmbedUrl(mediaUrl[key === 'ENGLISH' ? 'en' : key === 'KURDISH' ? 'ckb' : 'ar'])}
										<iframe
											src={getEmbedUrl(
												mediaUrl[key === 'ENGLISH' ? 'en' : key === 'KURDISH' ? 'ckb' : 'ar']
											)}
											class="w-full h-full"
											frameborder="0"
											allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
											allowfullscreen
											title="Embedded video"
										></iframe>
									{:else}
										<!-- svelte-ignore a11y-media-has-caption -->
										<video
											src={imagePreview[
												key === 'ENGLISH' ? 'en' : key === 'KURDISH' ? 'ckb' : 'ar'
											]}
											controls
											class="w-full h-full object-contain"
										>
											{$_('your-browser-does-not-support-the-video-tag')}
										</video>
									{/if}
								{:else}
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
				class="px-6 py-2 bg-orange-500 text-white rounded-lg transition duration-300 ease-in-out"
				disabled={isLoading}
			>
				{#if isLoading}
					<Spinner class="mr-3" size="4" color="white" />
					{$_('loading')}... {$progressLoading ?? 0}%
				{/if}
				{$_('add-carousel')}
			</Button>
		</div>
	</form>
</Card>
