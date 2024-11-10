<script lang="ts">
	import { Modal, Button, Label, Input, Toggle } from 'flowbite-svelte';
	import { _, locale } from 'svelte-i18n';
	import type { RouteEntity } from '$lib/Models/Entities/Route';
	import type { OptionEntity } from '$lib/Models/Entities/Option';
	import { settingStore } from '$lib/Stores/Setting';
	import { optionStore } from '$lib/Stores/Option';
	import type { InsertOption, Language } from '$lib/Supabase/Types/database.types';
	import AnimatedToggle from '$lib/Components/AnimatedToggle.svelte';

	export let showModal = false;
	export let route: RouteEntity | null = null;

	let newOption: InsertOption = {
		field: '',
		disabled: false
	};

	let previousShowModal = showModal;

	$: if (showModal && route && !previousShowModal) {
		previousShowModal = showModal;
		loadSettings();
	}

	async function loadSettings() {
		if (!route?.setting?.id) {
			// Create a setting for this route if it doesn't exist
			const setting = await settingStore.fetchSettingByRouteId(route!.id);
			route!.setting = setting;
			optionStore.set({
				data: setting.options ?? [],
				total: setting.options?.length ?? 0
			});
		} else {
			route.setting = await settingStore.fetch(route!.setting!.id);
			optionStore.set({
				data: route.setting.options ?? [],
				total: route.setting.options?.length ?? 0
			});
		}
	}

	async function addOption() {
		if (!newOption.field?.trim()) return;

		await optionStore.insert({
			...newOption,
			setting: route!.setting!.id
		});

		newOption = {
			field: '',
			disabled: false
		};

		await loadSettings();
	}

	async function toggleOption(option: OptionEntity) {
		await optionStore.put({
			id: option.id,
			disabled: !option.disabled
		});
		await loadSettings();
	}

	async function deleteOption(optionId: number) {
		await optionStore.remove(optionId);
	}

	function getLanguageData(route: Language | null | undefined) {
		return (route?.[($locale ?? 'en') as keyof Language] ?? $_('no-title')).toString();
	}
</script>

<Modal bind:open={showModal} size="md" autoclose={false}>
	<div class="p-4">
		<h2 class="text-xl font-bold mb-4 dark:text-white">
			{$_('settings-for')}
			{getLanguageData(route?.name)}
		</h2>

		<div class="mb-4">
			<Label for="newOption">{$_('new-option')}</Label>
			<div class="flex items-center gap-2">
				<Input id="newOption" bind:value={newOption.field} placeholder={$_('enter-option-field')} />
				<Toggle bind:checked={newOption.disabled} />
				<Button color="green" on:click={addOption}>{$_('add')}</Button>
			</div>
		</div>

		<div class="space-y-2">
			{#each $optionStore.data as option (option.id)}
				<div class="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
					<span class="dark:text-white">{option.field}</span>
					<div class="flex items-center gap-2">
						<AnimatedToggle checked={!option.disabled} on:change={() => toggleOption(option)} />
						<Button color="red" size="xs" on:click={() => deleteOption(option.id)}>
							{$_('delete')}
						</Button>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<div slot="footer" class="flex justify-end">
		<Button color="alternative" on:click={() => (showModal = false)}>
			{$_('close')}
		</Button>
	</div>
</Modal>
