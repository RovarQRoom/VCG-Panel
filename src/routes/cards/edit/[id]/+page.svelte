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
			<div class="w-full h-12 flex justify-center items-center bg-input-light dark:bg-input-dark rounded-xl relative gap-2">
				<svg width="30px" height="30px" class="fill-blue dark:fill-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path opacity="0.5" d="M22 13.75V11.5479C22 8.91554 22 7.59935 21.2305 6.74383C21.1598 6.66514 21.0849 6.59024 21.0062 6.51946C20.1506 5.75 18.8345 5.75 16.2021 5.75H15.8284C14.6747 5.75 14.0979 5.75 13.5604 5.59678C13.2651 5.5126 12.9804 5.39471 12.7121 5.24543C12.2237 4.97367 11.8158 4.56578 11 3.75L10.4497 3.19975C10.1763 2.92633 10.0396 2.78961 9.89594 2.67051C9.27652 2.15704 8.51665 1.84229 7.71557 1.76738C7.52976 1.75 7.33642 1.75 6.94975 1.75C6.06722 1.75 5.62595 1.75 5.25839 1.81935C3.64031 2.12464 2.37464 3.39031 2.06935 5.00839C2 5.37595 2 5.81722 2 6.69975V13.75C2 17.5212 2 19.4069 3.17157 20.5784C4.34315 21.75 6.22876 21.75 10 21.75H14C17.7712 21.75 19.6569 21.75 20.8284 20.5784C22 19.4069 22 17.5212 22 13.75Z"/>
					<path d="M12 11C12.4142 11 12.75 11.3358 12.75 11.75V13H14C14.4142 13 14.75 13.3358 14.75 13.75C14.75 14.1642 14.4142 14.5 14 14.5H12.75V15.75C12.75 16.1642 12.4142 16.5 12 16.5C11.5858 16.5 11.25 16.1642 11.25 15.75V14.5H10C9.58579 14.5 9.25 14.1642 9.25 13.75C9.25 13.3358 9.58579 13 10 13H11.25V11.75C11.25 11.3358 11.5858 11 12 11Z"/>
					</svg>

					<p>{$_('add-image')}</p>
				<Input
					type="file"
					class="bg-input-light dark:bg-input-dark border-0 opacity-0 absolute"
					id="icon"
					accept="image/*"
					on:change={handleFileSelect}
				/>
			</div>
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
