<script lang="ts">
	import { Card, Button, Label, Input, Tabs, TabItem, Fileupload, Spinner } from 'flowbite-svelte';
	import Editor from '@tinymce/tinymce-svelte';
	import {
		LanguageEnum,
		type Language,
		type UpdateRepresentative,
		HeadingEnum,
		type InsertHeading,
		type UpdateHeading,
		type InsertLanguage,
		type UpdateLanguage
	} from '$lib/Supabase/Types/database.types';
	import { _, locale } from 'svelte-i18n';
	import { PencilSquare, DocumentCheck } from 'svelte-heros-v2';
	import { onMount } from 'svelte';
	import { representativeStore } from '$lib/Stores/Representative';
	import { languageStore } from '$lib/Stores/Language';
	import { storageStore } from '$lib/Stores/Storage';
	import { VITE_SUPABASE_STORAGE_URL } from '$env/static/public';
	import { fade } from 'svelte/transition';
	import { toastStore } from '$lib/Stores/Toast';
	import { headingStore } from '$lib/Stores/Heading';

	let nameLanguage: { en: string; ckb?: string; ar?: string } = { en: '' };
	let descriptionLanguage: { en: string; ckb?: string; ar?: string } = { en: '' };
	let representative: UpdateRepresentative = {};

	let selectedFile: File | null = null;
	let imagePreview: string | null = null;

	let isEditing = false;
	let isSmallScreen: boolean;
	let isSaving = false; // New variable to track saving state

	let titleLanguage = {
		en: '',
		ckb: ''
	};
	let createHeading: UpdateHeading = {
		title: 0,
		heading_type: HeadingEnum.REPRESENTATIVE
	};

	onMount(() => {
		(async () => {
			await representativeStore.fetchLatest();
			if ($representativeStore) {
				nameLanguage = {
					en: $representativeStore.name?.en || '',
					ckb: $representativeStore.name?.ckb || '',
					ar: $representativeStore.name?.ar || ''
				};
				descriptionLanguage = {
					en: $representativeStore.description?.en || '',
					ckb: $representativeStore.description?.ckb || '',
					ar: $representativeStore.description?.ar || ''
				};
				representative.id = $representativeStore.id;
				representative.image = $representativeStore.image;
				representative.name = $representativeStore.name?.id;
				representative.description = $representativeStore.description?.id;
				imagePreview = `${VITE_SUPABASE_STORAGE_URL}${$representativeStore.image}`;
			}
			await headingStore.fetchByType(HeadingEnum.REPRESENTATIVE);
			if ($headingStore) {
				titleLanguage.en = $headingStore.title?.en ?? '';
				titleLanguage.ckb = $headingStore.title?.ckb ?? '';
				createHeading.id = $headingStore.id;
				createHeading.title = $headingStore.title?.id ?? 0;
			}
			checkScreenSize();
			window.addEventListener('resize', checkScreenSize);
		})();

		return () => window.removeEventListener('resize', checkScreenSize);
	});

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			selectedFile = input.files[0];
			imagePreview = URL.createObjectURL(selectedFile);
		}
	}

	function toggleEdit() {
		isEditing = !isEditing;
	}

	async function handleSave() {
		if (isSaving) return; // Prevent multiple clicks
		isSaving = true;
		isEditing = false;
		let descriptionResponse: Language | null = null;
		let nameResponse: Language | null = null;
		let imageResponse: {
			id: string;
			path: string;
			fullPath: string;
		} | null = null;
		try {
			descriptionResponse = representative.description
				? await languageStore.put({
						...descriptionLanguage,
						id: representative.description
					})
				: await languageStore.insert(descriptionLanguage as InsertLanguage);
			nameResponse = representative.name
				? await languageStore.put({
						...nameLanguage,
						id: representative.name
					} as UpdateLanguage)
				: await languageStore.insert(nameLanguage as InsertLanguage);
			if (selectedFile && selectedFile.size > 0) {
				imageResponse = await storageStore.uploadFile(selectedFile);
			}
			representative.description = descriptionResponse?.id;
			representative.name = nameResponse?.id;
			representative.image = imageResponse?.fullPath;
			const response = representative.id
				? await representativeStore.put({
						...representative,
						id: representative.id
					} as UpdateRepresentative)
				: await representativeStore.insert(representative);
			if (response && response.id) {
				representative = {
					id: response.id,
					image: response.image,
					name: response.name?.id,
					description: response.description?.id
				};
				imagePreview = `${VITE_SUPABASE_STORAGE_URL}${response.image}`;
				nameLanguage = {
					en: nameLanguage.en,
					ckb: nameLanguage.ckb,
					ar: nameLanguage.ar
				};
				descriptionLanguage = {
					en: descriptionLanguage.en,
					ckb: descriptionLanguage.ckb,
					ar: descriptionLanguage.ar
				};
			}
		} catch (error) {
			console.error(error);
			if (descriptionResponse && descriptionResponse.id) {
				await languageStore.remove(descriptionResponse.id);
			}
			if (nameResponse && nameResponse.id) {
				await languageStore.remove(nameResponse.id);
			}
			if (imageResponse && imageResponse.id) {
				await storageStore.removeFile(imageResponse.id);
			}
			if (error instanceof Error) {
				toastStore.showToast(error.message, 'error');
			} else {
				toastStore.showToast($_('unknown-error-occurred'), 'error');
			}
		} finally {
			isSaving = false; // Reset saving state
		}
	}

	async function saveHeading() {
		if (isSaving) return;
		isSaving = true;
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
					heading_type: HeadingEnum.REPRESENTATIVE
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
			isSaving = false;
		}
	}

	// Add TinyMCE configuration
	let conf = {
		height: 500,
		menubar: false,
		plugins: [
			'advlist',
			'autolink',
			'lists',
			'link',
			'image',
			'charmap',
			'anchor',
			'searchreplace',
			'visualblocks',
			'code',
			'fullscreen',
			'insertdatetime',
			'media',
			'table',
			'preview',
			'help',
			'wordcount'
		],
		toolbar:
			'undo redo | blocks | ' +
			'bold italic forecolor | alignleft aligncenter ' +
			'alignright alignjustify | bullist numlist outdent indent | ' +
			'removeformat | help'
	};

	// Add a function to determine if the screen is small
	function checkScreenSize() {
		isSmallScreen = window.innerWidth < 768;
	}
</script>

<div class="mb-8 max-w-2xl mx-auto mt-24">
	<div class="bg-[#f1f1f1] dark:bg-[#212121] rounded-lg p-4">
		<div class="flex justify-between items-center mb-3">
			<h2 class="text-lg font-semibold">{$_('title')}</h2>
			<div class="flex gap-2">
				<Button
					size="xs"
					class="{isEditing
						? 'bg-red-500'
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

		<Tabs style="pill" class="flex justify-center rounded-lg p-2">
			<TabItem
				open
				activeClasses="w-24 h-12 text-blue flex justify-center items-center bg-zinc-200 dark:bg-zinc-800 rounded-xl"
				inactiveClasses="w-24 h-12 dark:text-white flex justify-center items-center"
				class=" backdrop-blur-sm shadow-sm rounded-lg transition-all duration-200 hover:bg-slate-300 dark:hover:bg-slate-800"
			>
				<div slot="title" class="py-1 px-3">
					<span>{$_('english')}</span>
				</div>
				<div class="py-2" dir="ltr">
					<Input
						type="text"
						dir="ltr"
						class="w-full px-3 py-2 rounded-lg 
							    text-gray-900 dark:text-white
							   bg-zinc-300 dark:bg-zinc-900 border-0
							   transition-all duration-200 ease-in-out
							   placeholder:text-gray-400 dark:placeholder:text-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
						placeholder="Enter English title"
						bind:value={titleLanguage.en}
						disabled={!isEditing}
					/>
				</div>
			</TabItem>

			<TabItem
				activeClasses="w-24 h-12 text-blue flex justify-center items-center bg-zinc-200 dark:bg-zinc-800 rounded-xl"
				inactiveClasses="w-24 h-12 dark:text-white flex justify-center items-center"
				open
				class="backdrop-blur-sm shadow-sm rounded-lg transition-all duration-200 hover:bg-slate-300 dark:hover:bg-slate-800"
			>
				<div slot="title" class="py-1 px-3">
					<span>{$_('kurdish')}</span>
				</div>
				<div class="py-2" dir="rtl">
					<Input
						type="text"
						dir="rtl"
						class="w-full px-3 py-2 rounded-lg bg-zinc-300 dark:bg-zinc-900 border-0
							   text-gray-900 dark:text-white
							   transition-all duration-200 ease-in-out
							   placeholder:text-gray-400 dark:placeholder:text-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
						placeholder="Enter Kurdish title"
						bind:value={titleLanguage.ckb}
						disabled={!isEditing}
					/>
				</div>
			</TabItem>
		</Tabs>
	</div>
</div>

<div class="container mx-auto px-4 py-8">
	<Card class="max-w-4xl mx-auto p-4 sm:p-6 bg-white dark:bg-main-dark shadow-lg rounded-lg">
		<div class="flex mb-4 justify-between items-center">
			<h1 class="text-2xl font-bold text-gray-800">{$_('representative-details')}</h1>
			<div class="flex space-x-2">
				<Button
					on:click={toggleEdit}
					class="px-4 py-2 rounded-lg {isEditing
						? 'bg-red-500 dark:bg-red-500'
						: 'bg-blue dark:bg-blue hover:bg-blue dark:hover:bg-blue'} focus:ring-0"
					disabled={isSaving}
				>
					{#if isEditing}
						{$_('cancel')}
					{:else}
						{$_('edit')}
					{/if}
				</Button>
				{#if isEditing}
					<Button
						on:click={handleSave}
						class="px-2 py-2 rounded-lg"
						color="green"
						disabled={isSaving}
					>
						{#if isSaving}
							<Spinner size="4" color="white" />
						{:else}
							{$_('save')}
						{/if}
					</Button>
				{/if}
			</div>
		</div>

		<div class="flex flex-col md:flex-row items-center mb-6 space-y-6 md:space-y-0 md:space-x-6">
			<div class="w-full md:w-1/3">
				<div
					class="w-64 h-64 mx-auto overflow-hidden mb-4 rounded-xl shadow-md transition-transform duration-300 hover:scale-105"
				>
					{#if imagePreview}
						<img src={imagePreview} alt="Representative" class="w-full h-full object-cover" />
					{:else}
						<div class="w-full h-full bg-gray-200 flex items-center justify-center">
							<p class="text-gray-400 text-sm">{$_('no-image-selected')}</p>
						</div>
					{/if}
				</div>
				<div
					class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded-md shadow-md"
				>
					<div class="flex items-center">
						<svg
							class="w-20 h-20 mr-3"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fill-rule="evenodd"
								d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
								clip-rule="evenodd"
							></path>
						</svg>
						<p class="font-bold text-sm">{$_('warning-image')}</p>
					</div>
				</div>
				<div class="flex justify-center">
					<Fileupload
						id="file-upload"
						class="hidden"
						accept="image/*"
						on:change={handleFileSelect}
						disabled={!isEditing}
					/>
					<Button
						on:click={() => document.getElementById('file-upload')?.click()}
						class="px-4 py-2 w-full sm:w-auto bg-blue dark:bg-blue hover:bg-blue dark:hover:bg-blue"
						disabled={!isEditing}
					>
						{$_('change-photo')}
					</Button>
				</div>
			</div>

			<div class="w-full md:w-2/3">
				<Tabs style="pills" class="justify-center mb-6">
					{#each Object.keys(LanguageEnum).filter((key) => key !== 'ARABIC') as key}
						<TabItem
							open={key === 'KURDISH'}
							title={$_(key.toLowerCase())}
							activeClasses="w-24 h-12 text-blue flex justify-center items-center bg-zinc-200 dark:bg-zinc-800 rounded-xl"
							inactiveClasses="w-24 h-12 dark:text-white flex justify-center items-center"
						>
							<div transition:fade={{ duration: 300 }}>
								<div class="mt-4">
									<Label for="name-{key.toLowerCase()}" class="mb-2">{$_('name')} ({key})</Label>
									<Input
										class="bg-input-light dark:bg-input-dark border-0"
										type="text"
										id="name-{key.toLowerCase()}"
										placeholder={$_('enter-representative-name')}
										bind:value={nameLanguage[
											key === 'ENGLISH'
												? 'en'
												: key === 'KURDISH'
													? 'ckb'
													: key === 'ARABIC'
														? 'ar'
														: 'en'
										]}
										disabled={!isEditing}
									/>
								</div>
								<div class="mt-4">
									<Label for="description" class="mb-2">{$_('description')}</Label>
									<div class="border border-gray-300 rounded-lg p-2">
										<Editor
											apiKey="olyqgwptv2negfn1hj95rbkolfmo81y6hudkm6qi8gu3vx0m"
											{conf}
											bind:value={descriptionLanguage[
												key === 'ENGLISH'
													? 'en'
													: key === 'KURDISH'
														? 'ckb'
														: key === 'ARABIC'
															? 'ar'
															: 'en'
											]}
											disabled={!isEditing}
											cssClass="disabled:cursor-not-allowed"
										/>
									</div>
								</div>
							</div>
						</TabItem>
					{/each}
				</Tabs>
			</div>
		</div>
	</Card>
</div>
