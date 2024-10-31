<script lang="ts">
	import { Card, Button, Label, Input, Spinner, Img } from 'flowbite-svelte';
	import { PencilSquare, DocumentCheck, Plus, Trash, ArrowUp } from 'svelte-heros-v2';
	import { onMount } from 'svelte';
	import { footerStore } from '$lib/Stores/Footer';
	import { FooterEntity } from '$lib/Models/Entities/Footer';
	import { _ } from 'svelte-i18n';
	import { toastStore } from '$lib/Stores/Toast';
	import { storageStore } from '$lib/Stores/Storage';
	import type { Social } from '$lib/Supabase/Types/database.types';
	import { socialStore } from '$lib/Stores/Social';
	import moment from 'moment';
	import { VITE_SUPABASE_STORAGE_URL } from '$env/static/public';

	let footer: FooterEntity = new FooterEntity();
	let isEditing = false;
	let isSaving = false;

	onMount(async () => {
		const latestFooter = await footerStore.fetchLatest();
		if (latestFooter) {
			footer = latestFooter;
			console.log(footer.socials);
			footer.socials.forEach((social, index) => {
				icons[index] = {
					file: null,
					localUrl: social.icon ? `${VITE_SUPABASE_STORAGE_URL}${social.icon}` : null
				};
			});
		}
	});
	let icons: {
		file: File | null;
		localUrl: string | null;
	}[] = [];

	function toggleEdit() {
		isEditing = !isEditing;
	}

	function addPhone() {
		footer.phones = [...footer.phones, ''];
	}

	function removePhone(index: number) {
		footer.phones = footer.phones.filter((_, i) => i !== index);
	}

	function addSocial() {
		footer.socials = [
			...footer.socials,
			{ id: 0, name: '', link: '', footer: null, created_at: '', deleted_at: null, icon: null }
		];
	}

	function removeSocial(index: number) {
		footer.socials = footer.socials.filter((_, i) => i !== index);
		icons = icons.filter((_, i) => i !== index);
	}

	async function handleSave() {
		if (isSaving) return;
		isSaving = true;
		isEditing = false;
		let iconsResponse: {
			id: string | null;
			path: string | null;
			fullPath: string | null;
		}[] = [];
		let socialsResponse: Social[] = [];
		try {
			const response = footer.id ? await footerStore.put(footer) : await footerStore.insert(footer);
			if (response) {
				toastStore.showToast($_('footer-saved'), 'success');
			} else {
				toastStore.showToast($_('footer-not-saved'), 'error');
			}
			if (icons.length > 0) {
				iconsResponse = await Promise.all(
					icons.map(async (icon, index) => {
						if (icon.file && icon.file.size > 0) {
							const response = await storageStore.uploadFile(icon.file);
							footer.socials[index].icon = response.fullPath;
							return response;
						} else {
							return { fullPath: icon.localUrl, id: '', path: '' };
						}
					})
				);
			}
			socialsResponse = await socialStore.bulkInsert(
				footer.socials.map((social) => ({
					...social,
					footer: footer.id ?? 0,
					created_at: moment().toISOString()
				}))
			);
			const latestFooter = await footerStore.fetchLatest();
			if (latestFooter) {
				footer = latestFooter;
				footer.socials.forEach((social, index) => {
					icons[index] = {
						file: null,
						localUrl: social.icon ? `${VITE_SUPABASE_STORAGE_URL}${social.icon}` : null
					};
				});
			}
		} catch (error) {
			// Revert changes if an error occurs
			if (iconsResponse.length > 0) {
				await storageStore.removeFiles(iconsResponse.map((icon) => icon.path ?? ''));
			}
			if (socialsResponse.length > 0) {
				socialsResponse.forEach(async (social) => {
					await socialStore.remove(social.id);
				});
			}

			if (error instanceof Error) {
				toastStore.showToast(error.message, 'error');
			} else {
				toastStore.showToast($_('unknown-error-occurred'), 'error');
			}
		} finally {
			isSaving = false;
		}
	}

	async function handleImageUpload(event: Event, index: number) {
		const input = event.target as HTMLInputElement;
		if (!input.files?.length) return;

		const file = input.files[0];
		if (!file.type.startsWith('image/')) {
			toastStore.showToast($_('invalid-image-file'), 'error');
			return;
		}

		try {
			icons[index] = { file, localUrl: URL.createObjectURL(file) };
		} catch (error) {
			toastStore.showToast($_('image-upload-failed'), 'error');
		}
	}
</script>

<div class="container mx-auto px-4 py-8 mt-24">
	<Card class="max-w-4xl mx-auto p-4 sm:p-6 bg-white dark:bg-main-dark shadow-lg rounded-lg">
		<div class="flex mb-4 justify-between items-center">
			<h1 class="text-2xl font-bold text-gray-800">{$_('footer-details')}</h1>
			<div class="flex space-x-2">
				{#if isEditing}
					<Button
						on:click={handleSave}
						class="px-2 py-2 rounded-full mx-2"
						color="green"
						disabled={isSaving}
					>
						{#if isSaving}
							<Spinner size="4" color="white" />
						{:else}
							<DocumentCheck size="20" />
						{/if}
					</Button>
				{/if}
				<Button on:click={toggleEdit} class="px-2 py-2 rounded-full" disabled={isSaving}>
					<PencilSquare size="20" class={isEditing ? 'text-gray-300' : ''} />
				</Button>
			</div>
		</div>

		<div class="space-y-6">
			<div>
				<Label class="mb-2">{$_('phone-numbers')}</Label>
				<div class="max-h-[400px] overflow-y-auto pr-2">
					{#each footer.phones as phone, index}
						<div class="flex items-center space-x-2 mb-2 gap-2">
							<Input
								type="tel"
								class="bg-input-light dark:bg-input-dark border-0"
								bind:value={footer.phones[index]}
								disabled={!isEditing}
							/>
							{#if isEditing}
								<Button color="red" class="px-2 py-2" on:click={() => removePhone(index)}>
									<Trash size="20" />
								</Button>
							{/if}
						</div>
					{/each}
				</div>
				{#if isEditing}
					<Button on:click={addPhone} class="mt-2">
						<Plus size="20" class="mr-2" />
						{$_('add-phone')}
					</Button>
				{/if}
			</div>

			<div>
				<Label class="mb-2">{$_('social-media')}</Label>
				<div class="max-h-[400px] overflow-y-auto pr-2">
					{#each footer.socials as social, index}
						<div class="flex space-x-2 mb-2 items-end gap-2">
							<div class="flex flex-col w-full">
								<Label class="ml-2 mb-1">{$_('name')}</Label>
								<Input
									type="text"
									class="bg-input-light dark:bg-input-dark border-0"
									bind:value={social.name}
									placeholder={$_('social-name')}
									disabled={!isEditing}
								/>
							</div>
							<div class="flex flex-col w-full" dir="ltr">
								<Label class="ml-2 mb-1">{$_('link')}</Label>
								<Input
									type="url"
									class="bg-input-light dark:bg-input-dark border-0"
									bind:value={social.link}
									placeholder={$_('social-link')}
									disabled={!isEditing}
								/>
							</div>
							<div class="flex flex-col w-fit">
								<Label class="ml-1 mb-1">{$_('icon')}</Label>
								<div class="relative">
									{#if icons[index]?.localUrl || social.icon}
										<div class="flex items-center justify-center size-10">
											<Img
												src={icons[index]?.localUrl ?? social.icon ?? ''}
												alt="Social icon"
												class="object-cover rounded-lg"
											/>
										</div>
									{/if}
									{#if isEditing}
										<Input
											type="file"
											accept="image/*"
											class="absolute inset-0 opacity-0 cursor-pointer rounded-lg"
											on:change={(e) => handleImageUpload(e, index)}
											disabled={!isEditing}
										/>
									{/if}
									{#if !icons[index]?.localUrl && !social.icon}
										<div
											class="flex items-center justify-center w-10 h-10 border-2 border-dashed border-gray-300 rounded"
										>
											<ArrowUp size="20" />
										</div>
									{/if}
								</div>
							</div>
							{#if isEditing}
								<Button color="red" on:click={() => removeSocial(index)}>
									<Trash size="20" />
								</Button>
							{/if}
						</div>
					{/each}
				</div>
				{#if isEditing}
					<Button on:click={addSocial} class="mt-2">
						<Plus size="20" class="mr-2" />
						{$_('add-social')}
					</Button>
				{/if}
			</div>
		</div>
	</Card>
</div>
