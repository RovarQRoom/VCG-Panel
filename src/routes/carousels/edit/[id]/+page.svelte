<script lang="ts">
	import { onMount } from 'svelte';
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
	// @ts-ignore
	import ProgressBar from 'svelte-progress-bar';
	import { writable } from 'svelte/store';

	let carousel: UpdateCarousel | null = null;
	let titleLanguage: { en: string; ckb?: string; ar?: string } = { en: '' };
	let descriptionLanguage: { en: string; ckb?: string; ar?: string } = { en: '' };

	let selectedFile: { en: File | null; ckb?: File | null; ar?: File | null } = { en: null };
	let imagePreview: { en: string | null; ckb?: string | null; ar?: string | null } = { en: null };
	let progressLoading = writable(0);

	let isLoading = false;
	let thumbnail: {
		file: File | null;
		preview: string | null;
	} = {
		file: null,
		preview: null
	};
	let mediaUrl: {
		en: string;
		ckb?: string;
		ar?: string;
	} = {
		en: ''
	};

	// Add fileType variable
	let fileType: {
		en: 'image' | 'video' | null;
		ckb?: 'image' | 'video' | null;
		ar?: 'image' | 'video' | null;
	} = {
		en: null
	};

	let progress: any;

	// Add this helper function
	function isSupabasePath(path: string): boolean {
		return path.startsWith('files/') || path.startsWith('/files/');
	}

	onMount(async () => {
		progress.setWidthRatio(0);
		const response = await carouselStore.fetch(Number($page.params.id));
		carousel = {
			title: response.title?.id,
			description: response.description?.id,
			media: response.media?.id,
			id: response.id,
			thumbnail_video: response.thumbnail_video
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

		// Handle both Supabase paths and external URLs
		imagePreview = {
			en: response.media?.en
				? isSupabasePath(response.media.en)
					? `${VITE_SUPABASE_STORAGE_URL}${response.media.en}`
					: response.media.en
				: null,
			ckb: response.media?.ckb
				? isSupabasePath(response.media.ckb)
					? `${VITE_SUPABASE_STORAGE_URL}${response.media.ckb}`
					: response.media.ckb
				: null,
			ar: response.media?.ar
				? isSupabasePath(response.media.ar)
					? `${VITE_SUPABASE_STORAGE_URL}${response.media.ar}`
					: response.media.ar
				: null
		};

		// Set mediaUrl for external URLs
		mediaUrl = {
			en: response.media?.en && !isSupabasePath(response.media.en) ? response.media.en : '',
			ckb: response.media?.ckb && !isSupabasePath(response.media.ckb) ? response.media.ckb : '',
			ar: response.media?.ar && !isSupabasePath(response.media.ar) ? response.media.ar : ''
		};

		// Set fileType based on URLs or file paths
		fileType = {
			en: response.media?.en ? (isVideoUrl(response.media.en) ? 'video' : 'image') : null,
			ckb: response.media?.ckb ? (isVideoUrl(response.media.ckb) ? 'video' : 'image') : null,
			ar: response.media?.ar ? (isVideoUrl(response.media.ar) ? 'video' : 'image') : null
		};

		thumbnail.preview = `${VITE_SUPABASE_STORAGE_URL}${response.thumbnail_video}`;
	});

	function handleFileSelect(event: Event, lang: string) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			if (lang === 'en' || lang === 'ckb' || lang === 'ar') {
				selectedFile[lang] = input.files[0];
				imagePreview[lang] = URL.createObjectURL(input.files[0]);
				fileType[lang] = input.files[0].type.startsWith('image/') ? 'image' : 'video';
				mediaUrl[lang] = '';
			}
		}
	}

	function handleThumbnailSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			thumbnail.file = input.files[0];
			thumbnail.preview = URL.createObjectURL(input.files[0]);
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
			if (input.value) {
				clearFileInput(lang);
				fileType[lang] = isVideoUrl(input.value) ? 'video' : 'image';
				imagePreview[lang] = input.value; // Store just the URL for external media
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
			const fileInput = document.getElementById(`media-${lang}`) as HTMLInputElement;
			if (fileInput) {
				fileInput.value = '';
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
		let thumbnailResponse: {
			id: string;
			path: string;
			fullPath: string;
		} | null = null;
		let oldMedia = carousel.media;

		try {
			titleResponse = await languageStore.put({
				...titleLanguage,
				id: carousel.title
			});
			const progress1 = Number((Math.random() * (0.2 - 0.1) + 0.1).toFixed(2));
			progress.setWidthRatio(progress1);
			progressLoading.set(progress1 * 100);

			descriptionResponse = await languageStore.put({
				...descriptionLanguage,
				id: carousel.description ?? 0
			});

			const progress2 = Number((Math.random() * (0.6 - 0.5) + 0.5).toFixed(2));
			progress.setWidthRatio(progress2);
			progressLoading.set(progress2 * 100);

			if (oldMedia) {
				const existingMediaPaths = await languageStore.fetch(oldMedia);
				mediaResponse = { ...existingMediaPaths, id: oldMedia };
			}

			const progress3 = Number((Math.random() * (0.7 - 0.6) + 0.6).toFixed(2));
			progress.setWidthRatio(progress3);
			progressLoading.set(progress3 * 100);

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

			const progress4 = Number((Math.random() * (0.8 - 0.7) + 0.7).toFixed(2));
			progress.setWidthRatio(progress4);
			progressLoading.set(progress4 * 100);

			// Handle media paths - only store Supabase paths for uploaded files, full URLs for external media
			const mediaUrls = {
				en:
					mediaUrl.en ||
					(selectedFile.en
						? await storageStore
								.uploadFileWithLanguage(selectedFile.en, 'en')
								.then((r) => r.en.fullPath)
						: imagePreview.en
							? isSupabasePath(imagePreview.en.replace(VITE_SUPABASE_STORAGE_URL, ''))
								? imagePreview.en.replace(VITE_SUPABASE_STORAGE_URL, '')
								: imagePreview.en
							: ''),
				ar:
					mediaUrl.ar ||
					(selectedFile.ar
						? await storageStore
								.uploadFileWithLanguage(selectedFile.ar, 'ar')
								.then((r) => r.ar.fullPath)
						: imagePreview.ar
							? isSupabasePath(imagePreview.ar.replace(VITE_SUPABASE_STORAGE_URL, ''))
								? imagePreview.ar.replace(VITE_SUPABASE_STORAGE_URL, '')
								: imagePreview.ar
							: ''),
				ckb:
					mediaUrl.ckb ||
					(selectedFile.ckb
						? await storageStore
								.uploadFileWithLanguage(selectedFile.ckb, 'ckb')
								.then((r) => r.ckb.fullPath)
						: imagePreview.ckb
							? isSupabasePath(imagePreview.ckb.replace(VITE_SUPABASE_STORAGE_URL, ''))
								? imagePreview.ckb.replace(VITE_SUPABASE_STORAGE_URL, '')
								: imagePreview.ckb
							: '')
			};

			const progress5 = Number((Math.random() * (0.95 - 0.85) + 0.85).toFixed(2));
			progress.setWidthRatio(progress5);
			progressLoading.set(progress5 * 100);

			mediaResponse = await languageStore.put({
				...mediaUrls,
				id: carousel.media ?? 0
			});

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

			const progress6 = Number((Math.random() * (1 - 0.95) + 0.95).toFixed(2));
			progress.setWidthRatio(progress6);
			progressLoading.set(progress6 * 100);

			if (thumbnail.file && thumbnail.file.size > 0) {
				thumbnailResponse = await storageStore.uploadFile(thumbnail.file);
			}

			const updatedCarousel: UpdateCarousel = {
				...carousel,
				title: titleResponse?.id ?? carousel.title,
				description: descriptionResponse?.id ?? carousel.description,
				media: mediaResponse?.id ?? carousel.media,
				thumbnail_video: thumbnailResponse?.fullPath ?? carousel.thumbnail_video
			};

			await carouselStore.put(updatedCarousel);

			const progress7 = 1;
			progress.setWidthRatio(progress7);
			progressLoading.set(progress7 * 100);
			// Delete old media files if they were replaced
			if (oldMedia && mediaResponse) {
				const oldMediaPaths = await languageStore.fetch(oldMedia);

				for (const lang of ['en', 'ar', 'ckb'] as const) {
					if (oldMediaPaths[lang] && oldMediaPaths[lang] !== mediaResponse[lang]) {
						const filePathToDelete = oldMediaPaths[lang].replace(VITE_SUPABASE_STORAGE_URL, '');
						await storageStore.removeFile(filePathToDelete);
					}
				}
			}

			goto('/carousels/1');
		} catch (error) {
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
					await storageStore.removeFile(
						mediaFilesResponse[lang as keyof typeof mediaFilesResponse]!.id
					);
				}
			}
			if (error instanceof Error) {
				toastStore.showToast(error.message, 'error');
			} else {
				toastStore.showToast($_('unknown-error-occurred'), 'error');
			}
		} finally {
			isLoading = false;
			progressLoading.set(0);
			progress.setWidthRatio(0);
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

<ProgressBar bind:this={progress} color="#f17f18" />

<div class="mb-6">
	<Button color="light" on:click={goBack} class="px-4 py-2 border-0 dark:bg-input-dark">
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

<Card class="max-w-2xl mx-auto p-6 bg-white dark:bg-main-dark shadow-lg rounded-lg">
	<form on:submit|preventDefault={handleUpdate} class="flex flex-col space-y-6">
		{#if Object.values(fileType).some((type) => type === 'video') || Object.values(mediaUrl).some( (url) => isVideoUrl(url) )}
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
				<TabItem open title={$_(key.toLowerCase())}
				activeClasses="w-24 h-12 text-blue flex justify-center items-center bg-zinc-200 dark:bg-zinc-800 rounded-xl"
				inactiveClasses="w-24 h-12 dark:text-white flex justify-center items-center">
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
							required={key === 'ENGLISH'}
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
							required={key === 'ENGLISH'}
						/>
					</div>
					<div class="mt-4">
						<Label for="media-url-{key.toLowerCase()}" class="mb-2">
							{$_('media-url')} ({$_(key.toLowerCase())})
						</Label>
						<Input
							class="bg-input-light dark:bg-input-dark border-0 mb-4"
							type="url"
							id="media-url-{key.toLowerCase()}"
							placeholder="Enter media URL"
							value={mediaUrl[key === 'ENGLISH' ? 'en' : key === 'KURDISH' ? 'ckb' : 'ar']}
							on:input={(event) =>
								handleUrlInput(event, key === 'ENGLISH' ? 'en' : key === 'KURDISH' ? 'ckb' : 'ar')}
							disabled={!!selectedFile[key === 'ENGLISH' ? 'en' : key === 'KURDISH' ? 'ckb' : 'ar']}
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

						<Label for="media-{key.toLowerCase()}" class="mb-2">
							{$_('media-upload')} ({$_(key.toLowerCase())})
						</Label>
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
				class="px-6 py-2 bg-blue dark:bg-blue hover:bg-blue dark:hover:bg-blue text-white text-white rounded-lg transition duration-300 ease-in-out"
				disabled={isLoading}
			>
				{#if isLoading}
					<Spinner class="mr-3" size="4" color="white" />
					{$progressLoading ?? 0}%
				{/if}
				{$_('update-carousel')}
			</Button>
		</div>
	</form>
</Card>
