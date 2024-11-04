<script lang="ts">
	import { onMount } from 'svelte';
	import { Card, Button, Label, Input, Textarea, Tabs, TabItem, Spinner } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { cardStore } from '$lib/Stores/Card';
	import { languageStore } from '$lib/Stores/Language';
	import { storageStore } from '$lib/Stores/Storage';
	import { LanguageEnum, type UpdateCard, type Language } from '$lib/Supabase/Types/database.types';
	import { page } from '$app/stores';
	import { VITE_SUPABASE_STORAGE_URL } from '$env/static/public';
	import { _ } from 'svelte-i18n';
	import { toastStore } from '$lib/Stores/Toast';

	let card: UpdateCard = {
		link: ''
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

	onMount(async () => {
		const response = await cardStore.fetch(Number($page.params.id));
		card = {
			title: response.title?.id,
			description: response.description?.id,
			icon: response.icon,
			id: response.id,
			link: response.link ?? ''
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
		imagePreview = `${VITE_SUPABASE_STORAGE_URL}${response.icon}`;
	});

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			selectedFile = input.files[0];
			imagePreview = URL.createObjectURL(selectedFile);
		}
	}

	async function handleUpdate() {
		if (!card || isLoading) return;
		isLoading = true;

		let titleResponse: Language | null = null;
		let descriptionResponse: Language | null = null;
		let iconResponse: { fullPath: string } | null = null;
		let oldIcon = card.icon;

		try {
			titleResponse = await languageStore.put({
				...titleLanguage,
				id: card.title
			});
			descriptionResponse = await languageStore.put({
				...descriptionLanguage,
				id: card.description ?? 0
			});

			if (selectedFile && selectedFile.size > 0) {
				iconResponse = await storageStore.uploadFile(selectedFile);
				card.icon = iconResponse?.fullPath ?? null;
			}

			const updatedCard: UpdateCard = {
				...card,
				title: titleResponse?.id ?? card.title,
				description: descriptionResponse?.id ?? card.description
			};

			await cardStore.put(updatedCard);

			if (oldIcon && card.icon !== oldIcon) {
				await storageStore.removeFile(oldIcon);
			}

			goto('/cards/1');
		} catch (error) {
			console.error(error);

			// Revert changes if an error occurs
			if (titleResponse && titleResponse.id) {
				await languageStore.put(titleLanguage);
			}
			if (descriptionResponse && descriptionResponse.id) {
				await languageStore.put(descriptionLanguage);
			}
			if (iconResponse && iconResponse.fullPath) {
				await storageStore.removeFile(iconResponse.fullPath);
				card.icon = oldIcon;
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
		goto('/cards/1');
	}
</script>

<div class="mt-24">
	<Button
		color="light"
		on:click={goBack}
		class="px-4 py-2 bg-input-light dark:bg-input-dark border-0 m-4"
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
		Back
	</Button>
</div>

<h1 class="text-3xl font-bold mb-6">{$_('edit-card')}</h1>

<Card class="max-w-2xl mx-auto p-6 bg-white dark:bg-main-dark shadow-lg rounded-lg mb-4">
	<form on:submit|preventDefault={handleUpdate} class="flex flex-col space-y-6">
		<div>
			<Label for="link" class="mb-2">{$_('link')}</Label>
			<Input
				type="url"
				class="bg-input-light dark:bg-input-dark border-0"
				id="link"
				placeholder={$_('enter-card-link')}
				bind:value={card.link}
			/>
		</div>

		<div>
			<Label for="icon" class="mb-2">{$_('icon')}</Label>
			<Input
				type="file"
				class="bg-input-light dark:bg-input-dark border-0"
				id="icon"
				accept="image/*"
				on:change={handleFileSelect}
			/>
			<div class="mt-2 h-48 flex items-center justify-center overflow-hidden">
				{#if imagePreview && imagePreview !== `${VITE_SUPABASE_STORAGE_URL}null`}
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
			{#each Object.keys(LanguageEnum).filter((key) => key !== 'ARABIC') as key}
				<TabItem
					open
					title={$_(key.toLowerCase())}
					activeClasses="w-24 h-12 text-blue flex justify-center items-center bg-zinc-200 dark:bg-zinc-800 rounded-xl"
					inactiveClasses="w-24 h-12 dark:text-white flex justify-center items-center"
				>
					<div class="mt-4">
						<Label for="title-{key.toLowerCase()}" class="mb-2"
							>{$_('title')} ({$_(key.toLowerCase())})</Label
						>
						<Input
							type="text"
							class="bg-input-light dark:bg-input-dark border-0"
							id="title-{key.toLowerCase()}"
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
							required={key === 'ENGLISH'}
						/>
					</div>
					<div class="mt-4">
						<Label for="description-{key.toLowerCase()}" class="mb-2"
							>{$_('description')} ({$_(key.toLowerCase())})</Label
						>
						<Textarea
							class="bg-input-light dark:bg-input-dark border-0"
							id="description-{key.toLowerCase()}"
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
							required={key === 'ENGLISH'}
						/>
					</div>
				</TabItem>
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
				{/if}
				{$_('update-card')}
			</Button>
		</div>
	</form>
</Card>
