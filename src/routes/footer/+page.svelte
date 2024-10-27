<script lang="ts">
	import { Card, Button, Label, Input, Spinner } from 'flowbite-svelte';
	import { PencilSquare, DocumentCheck, Plus, Trash } from 'svelte-heros-v2';
	import { onMount } from 'svelte';
	import { footerStore } from '$lib/Stores/Footer';
	import { FooterEntity } from '$lib/Models/Entities/Footer';
	import type { Social } from '$lib/Supabase/Types/database.types';
	import { _ } from 'svelte-i18n';
	import { toastStore } from '$lib/Stores/Toast';

	let footer: FooterEntity = new FooterEntity();
	let isEditing = false;
	let isSaving = false;

	onMount(async () => {
		const latestFooter = await footerStore.fetchLatest();
		if (latestFooter) {
			footer = latestFooter;
		}
	});

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
	}

	async function handleSave() {
		if (isSaving) return;
		isSaving = true;
		isEditing = false;

		try {
			const response = footer.id ? await footerStore.put(footer) : await footerStore.insert(footer);
			if (response) {
				toastStore.showToast($_('footer-saved'), 'success');
			} else {
				toastStore.showToast($_('footer-not-saved'), 'error');
			}
		} catch (error) {
			toastStore.showToast($_('unknown-error-occurred'), 'error');
		} finally {
			isSaving = false;
		}
	}
</script>

<div class="container mx-auto px-4 py-8">
	<Card class="max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg">
		<div class="flex mb-4 justify-between items-center">
			<h1 class="text-2xl font-bold text-gray-800">{$_('footer-details')}</h1>
			<div class="flex space-x-2">
				{#if isEditing}
					<Button
						on:click={handleSave}
						class="px-2 py-2 rounded-full"
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
				{#each footer.phones as phone, index}
					<div class="flex items-center space-x-2 mb-2">
						<Input type="tel" bind:value={footer.phones[index]} disabled={!isEditing} />
						{#if isEditing}
							<Button color="red" class="px-2 py-2" on:click={() => removePhone(index)}>
								<Trash size="20" />
							</Button>
						{/if}
					</div>
				{/each}
				{#if isEditing}
					<Button on:click={addPhone} class="mt-2">
						<Plus size="20" class="mr-2" />
						{$_('add-phone')}
					</Button>
				{/if}
			</div>

			<div>
				<Label class="mb-2">{$_('social-media')}</Label>
				{#each footer.socials as social, index}
					<div class="flex space-x-2 mb-2 items-end">
						<div class="flex flex-col w-full">
							<Label class="ml-2 mb-1">{$_('name')}</Label>
							<Input
								type="text"
								bind:value={social.name}
								placeholder={$_('social-name')}
								disabled={!isEditing}
							/>
						</div>
						<div class="flex flex-col w-full">
							<Label class="ml-2 mb-1">{$_('link')}</Label>
							<Input
								type="url"
								bind:value={social.link}
								placeholder={$_('social-link')}
								disabled={!isEditing}
							/>
						</div>
						{#if isEditing}
							<Button color="red" class="px-2 py-2" on:click={() => removeSocial(index)}>
								<Trash size="20" />
							</Button>
						{/if}
					</div>
				{/each}
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
