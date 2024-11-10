<script lang="ts">
	import { Card, Button, Label, Input, Fileupload, Spinner } from 'flowbite-svelte';
	import { PencilSquare } from 'svelte-heros-v2';
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { userStore } from '$lib/Stores/User';
	import { storageStore } from '$lib/Stores/Storage';
	import { toastStore } from '$lib/Stores/Toast';
	import { VITE_SUPABASE_STORAGE_URL } from '$env/static/public';
	import type { UpdateUser } from '$lib/Supabase/Types/database.types';
	import { authStore } from '$lib/Stores/Authentication';

	let isEditing = false;
	let isSaving = false;
	let userData: UpdateUser = {
		id: 0,
		name: '',
		email: '',
		image: ''
	};
	let imageFile: {
		file: File | null;
		preview: string | null;
	} = {
		file: null,
		preview: null
	};

	onMount(async () => {
		const user = $authStore;
		if (user) {
			userData = {
				id: user.id,
				name: user.name || '',
				email: user.email || '',
				image: user.image || ''
			};
			if (user.image) {
				imageFile.preview = `${VITE_SUPABASE_STORAGE_URL}${user.image}`;
			}
		}
	});

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			imageFile.file = input.files[0];
			imageFile.preview = URL.createObjectURL(imageFile.file);
		}
	}

	function toggleEdit() {
		isEditing = !isEditing;
	}

	async function handleSave() {
		if (isSaving) return;
		isSaving = true;
		try {
			let imageResponse = null;
			if (imageFile.file) {
				imageResponse = await storageStore.uploadFile(imageFile.file);
				userData.image = imageResponse.fullPath;
			}

			await userStore.putProfile(userData);

			isEditing = false;
			toastStore.showToast($_('profile-updated-successfully'), 'success');
		} catch (error) {
			if (error instanceof Error) {
				toastStore.showToast(error.message, 'error');
			} else {
				toastStore.showToast($_('failed-to-update-profile'), 'error');
			}
		} finally {
			isSaving = false;
		}
	}
</script>

<div class="container mx-auto px-4 py-8">
	<Card class="max-w-2xl mx-auto p-6 bg-white dark:bg-main-dark shadow-lg rounded-lg">
		<div class="flex mb-6 justify-between items-center">
			<h1 class="text-2xl font-bold text-gray-800 dark:text-white">{$_('profile-settings')}</h1>
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
						<PencilSquare class="w-5 h-5 mr-2" />
						{$_('edit')}
					{/if}
				</Button>
				{#if isEditing}
					<Button
						on:click={handleSave}
						class="px-4 py-2 rounded-lg"
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

		<div class="flex flex-col items-center mb-8">
			<div
				class="w-32 h-32 mb-4 overflow-hidden rounded-full shadow-lg transition-transform duration-300 hover:scale-105"
			>
				{#if imageFile.preview}
					<img src={imageFile.preview} alt="Profile" class="w-full h-full object-cover" />
				{:else}
					<div class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
						<svg
							class="w-16 h-16 text-gray-400 dark:text-gray-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
					</div>
				{/if}
			</div>

			{#if isEditing}
				<div class="flex justify-center mb-6">
					<Fileupload
						id="profile-upload"
						class="hidden"
						accept="image/*"
						on:change={handleFileSelect}
					/>
					<Button
						on:click={() => document.getElementById('profile-upload')?.click()}
						class="px-4 py-2 bg-blue dark:bg-blue hover:bg-blue dark:hover:bg-blue"
					>
						{$_('change-photo')}
					</Button>
				</div>
			{/if}
		</div>

		<div class="space-y-6">
			<div>
				<Label for="name" class="mb-2">{$_('name')}</Label>
				<Input
					id="name"
					type="text"
					class="bg-input-light dark:bg-input-dark border-0"
					bind:value={userData.name}
					placeholder={$_('enter-your-name')}
					disabled={!isEditing}
				/>
			</div>

			<div>
				<Label for="email" class="mb-2">{$_('email')}</Label>
				<Input
					id="email"
					type="email"
					class="bg-input-light dark:bg-input-dark border-0"
					value={userData.email}
					disabled={true}
				/>
				<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
					{$_('email-cannot-be-changed')}
				</p>
			</div>
		</div>
	</Card>
</div>
