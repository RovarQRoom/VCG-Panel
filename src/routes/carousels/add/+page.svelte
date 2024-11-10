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

<div class="mt-24">
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

<Card class="max-w-2xl mx-auto p-6 bg-white dark:bg-main-dark shadow-lg rounded-lg mb-4">
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
				<TabItem
					open
					title={$_(key.toLowerCase())}
					activeClasses="w-24 h-12 text-blue flex justify-center items-center bg-zinc-200 dark:bg-zinc-800 rounded-xl"
					inactiveClasses="w-24 h-12 dark:text-white flex justify-center items-center"
				>
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
						<div class="bg-input-light dark:bg-input-dark border-0 rounded-xl relative">
							<div class="w-full h-auto flex justify-center items-center absolute gap-2">
								<svg
									width="40px"
									height="40px"
									viewBox="0 0 24 24"
									class="fill-blue dark:fill-white"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										opacity="0.5"
										d="M22 13.75V11.5479C22 8.91554 22 7.59935 21.2305 6.74383C21.1598 6.66514 21.0849 6.59024 21.0062 6.51946C20.1506 5.75 18.8345 5.75 16.2021 5.75H15.8284C14.6747 5.75 14.0979 5.75 13.5604 5.59678C13.2651 5.5126 12.9804 5.39471 12.7121 5.24543C12.2237 4.97367 11.8158 4.56578 11 3.75L10.4497 3.19975C10.1763 2.92633 10.0396 2.78961 9.89594 2.67051C9.27652 2.15704 8.51665 1.84229 7.71557 1.76738C7.52976 1.75 7.33642 1.75 6.94975 1.75C6.06722 1.75 5.62595 1.75 5.25839 1.81935C3.64031 2.12464 2.37464 3.39031 2.06935 5.00839C2 5.37595 2 5.81722 2 6.69975V13.75C2 17.5212 2 19.4069 3.17157 20.5784C4.34315 21.75 6.22876 21.75 10 21.75H14C17.7712 21.75 19.6569 21.75 20.8284 20.5784C22 19.4069 22 17.5212 22 13.75Z"
									/>
									<path
										d="M12 11C12.4142 11 12.75 11.3358 12.75 11.75V13H14C14.4142 13 14.75 13.3358 14.75 13.75C14.75 14.1642 14.4142 14.5 14 14.5H12.75V15.75C12.75 16.1642 12.4142 16.5 12 16.5C11.5858 16.5 11.25 16.1642 11.25 15.75V14.5H10C9.58579 14.5 9.25 14.1642 9.25 13.75C9.25 13.3358 9.58579 13 10 13H11.25V11.75C11.25 11.3358 11.5858 11 12 11Z"
										fill="#1C274C"
									/>
								</svg>
								<p>{$_('add-image')}</p>
							</div>

							<div class="relative">
								<Input
									class="bg-input-light dark:bg-input-dark border-0 opacity-0"
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
											src={imagePreview[
												key === 'ENGLISH' ? 'en' : key === 'KURDISH' ? 'ckb' : 'ar'
											]}
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
									<p class="text-gray-400">{$_('no-media-selected')}</p>
								{/if}
							</div>
						</div>
					</div></TabItem
				>
			{/each}
		</Tabs>

		<div class="flex justify-end">
			<Button
				type="submit"
				class="px-6 py-2 bg-blue dark:bg-blue hover:bg-blue dark:hover:bg-blue text-white rounded-lg transition duration-300 ease-in-out"
				disabled={isLoading}
			>
				{#if isLoading}
					<Spinner class="mr-3" size="4" color="white" />
					{$progressLoading ?? 0}%
				{/if}
				{$_('add-carousel')}
			</Button>
		</div>
	</form>
</Card>
