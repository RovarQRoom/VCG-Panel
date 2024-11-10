<script lang="ts">
	import { Modal, Button, Label, Input, Toggle } from 'flowbite-svelte';
	import { _, locale } from 'svelte-i18n';
	import type { RouteEntity } from '$lib/Models/Entities/Route';
	import type { OptionEntity } from '$lib/Models/Entities/Option';
	import { settingStore } from '$lib/Stores/Setting';
	import { optionStore } from '$lib/Stores/Option';
	import type { InsertOption, Language } from '$lib/Supabase/Types/database.types';

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

<Modal
	backdropClass="fixed top-0 start-0 end-0 h-modal md:inset-0 md:h-full z-50 w-full p-4 flex bg-black bg-opacity-50  backdrop-blur-sm"
	bind:open={showModal}
	defaultClass="relative flex flex-col mx-auto bg-main-light dark:bg-main-dark"
	footerClass="flex justify-end flex items-center p-4 md:p-5 space-x-3 rtl:space-x-reverse rounded-b-lg bg-main-light dark:bg-main-dark"
	size="md"
	autoclose={false}
>
	<div class="p-4">
		<h2 class="text-xl font-bold mb-4 dark:text-white">
			{$_('settings-for')}
			{getLanguageData(route?.name)}
		</h2>

		<div class="mb-4">
			<Label for="newOption">{$_('new-option')}</Label>
			<div class="flex items-center gap-2">
				<Input class="w-full bg-input-light  dark:bg-input-dark border-0" id="newOption" bind:value={newOption.field} placeholder={$_('enter-option-field')} />

				<div class="checkbox-wrapper-9 ml-3">
					<input
						class="tgl tgl-skewed"
						id="new-option-toggle"
						type="checkbox"
						bind:checked={newOption.disabled}
					/>
					<label
						class="tgl-btn"
						data-tg-off={$_('active')}
						data-tg-on={$_('disabled-route')}
						for="new-option-toggle"
					></label>
				</div>
				
				<Button color="green" on:click={addOption}>{$_('add')}</Button>
			</div>
		</div>

		<div class="space-y-2">
			{#each $optionStore.data as option (option.id)}
				<div class="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
					<span class="dark:text-white">{option.field}</span>
					<div class="flex items-center gap-2">

							<div class="checkbox-wrapper-8 ml-3">
								<input
									class="tgl tgl-skewed"
									id="toggle-{option.id}"
									type="checkbox"
									checked={option.disabled}
									on:change={() => toggleOption(option)}
								/>
								<label
									class="tgl-btn"
									data-tg-off={$_('active')}
									data-tg-on={$_('disabled-route')}
									for="toggle-{option.id}"
								></label>
							</div>
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



<style>
	.checkbox-wrapper-9 .tgl {
		display: none;
	}
	.checkbox-wrapper-9 .tgl,
	.checkbox-wrapper-9 .tgl:after,
	.checkbox-wrapper-9 .tgl:before,
	.checkbox-wrapper-9 .tgl *,
	.checkbox-wrapper-9 .tgl *:after,
	.checkbox-wrapper-9 .tgl *:before,
	.checkbox-wrapper-9 .tgl + .tgl-btn {
		box-sizing: border-box;
	}
	.checkbox-wrapper-9 .tgl::-moz-selection,
	.checkbox-wrapper-9 .tgl:after::-moz-selection,
	.checkbox-wrapper-9 .tgl:before::-moz-selection,
	.checkbox-wrapper-9 .tgl *::-moz-selection,
	.checkbox-wrapper-9 .tgl *:after::-moz-selection,
	.checkbox-wrapper-9 .tgl *:before::-moz-selection,
	.checkbox-wrapper-9 .tgl + .tgl-btn::-moz-selection,
	.checkbox-wrapper-9 .tgl::selection,
	.checkbox-wrapper-9 .tgl:after::selection,
	.checkbox-wrapper-9 .tgl:before::selection,
	.checkbox-wrapper-9 .tgl *::selection,
	.checkbox-wrapper-9 .tgl *:after::selection,
	.checkbox-wrapper-9 .tgl *:before::selection,
	.checkbox-wrapper-9 .tgl + .tgl-btn::selection {
		background: none;
	}
	.checkbox-wrapper-9 .tgl + .tgl-btn {
		outline: 0;
		display: block;
		width: 4em;
		height: 2em;
		position: relative;
		cursor: pointer;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	.checkbox-wrapper-9 .tgl + .tgl-btn:after,
	.checkbox-wrapper-9 .tgl + .tgl-btn:before {
		position: relative;
		display: block;
		content: '';
		width: 50%;
		height: 100%;
	}
	.checkbox-wrapper-9 .tgl + .tgl-btn:after {
		left: 0;
	}
	.checkbox-wrapper-9 .tgl + .tgl-btn:before {
		display: none;
	}
	.checkbox-wrapper-9 .tgl:checked + .tgl-btn:after {
		left: 50%;
	}

	.checkbox-wrapper-9 .tgl-skewed + .tgl-btn {
		overflow: hidden;
		transform: skew(-10deg);
		-webkit-backface-visibility: hidden;
		backface-visibility: hidden;
		transition: all 0.2s ease;
		font-family: sans-serif;
		background: #86d993;
	}
	.checkbox-wrapper-9 .tgl-skewed + .tgl-btn:after,
	.checkbox-wrapper-9 .tgl-skewed + .tgl-btn:before {
		transform: skew(10deg);
		display: inline-block;
		transition: all 0.2s ease;
		width: 100%;
		text-align: center;
		position: absolute;
		line-height: 2em;
		font-weight: bold;
		color: #fff;
		text-shadow: 0 1px 0 rgba(0, 0, 0, 0.4);
	}
	.checkbox-wrapper-9 .tgl-skewed + .tgl-btn:after {
		left: 100%;
		content: attr(data-tg-on);
	}
	.checkbox-wrapper-9 .tgl-skewed + .tgl-btn:before {
		left: 0;
		content: attr(data-tg-off);
	}
	.checkbox-wrapper-9 .tgl-skewed + .tgl-btn:active {
		background: #888;
	}
	.checkbox-wrapper-8 .tgl-skewed + .tgl-btn:active:before {
		left: -10%;
	}
	.checkbox-wrapper-9 .tgl-skewed:checked + .tgl-btn {
		background: #888;
	}
	.checkbox-wrapper-9 .tgl-skewed:checked + .tgl-btn:before {
		left: -100%;
	}
	.checkbox-wrapper-9 .tgl-skewed:checked + .tgl-btn:after {
		left: 0;
	}
	.checkbox-wrapper-9 .tgl-skewed:checked + .tgl-btn:active:after {
		left: 10%;
	}









	.checkbox-wrapper-8 .tgl {
		display: none;
	}
	.checkbox-wrapper-8 .tgl,
	.checkbox-wrapper-8 .tgl:after,
	.checkbox-wrapper-8 .tgl:before,
	.checkbox-wrapper-8 .tgl *,
	.checkbox-wrapper-8 .tgl *:after,
	.checkbox-wrapper-8 .tgl *:before,
	.checkbox-wrapper-8 .tgl + .tgl-btn {
		box-sizing: border-box;
	}
	.checkbox-wrapper-8 .tgl::-moz-selection,
	.checkbox-wrapper-8 .tgl:after::-moz-selection,
	.checkbox-wrapper-8 .tgl:before::-moz-selection,
	.checkbox-wrapper-8 .tgl *::-moz-selection,
	.checkbox-wrapper-8 .tgl *:after::-moz-selection,
	.checkbox-wrapper-8 .tgl *:before::-moz-selection,
	.checkbox-wrapper-8 .tgl + .tgl-btn::-moz-selection,
	.checkbox-wrapper-8 .tgl::selection,
	.checkbox-wrapper-8 .tgl:after::selection,
	.checkbox-wrapper-8 .tgl:before::selection,
	.checkbox-wrapper-8 .tgl *::selection,
	.checkbox-wrapper-8 .tgl *:after::selection,
	.checkbox-wrapper-8 .tgl *:before::selection,
	.checkbox-wrapper-8 .tgl + .tgl-btn::selection {
		background: none;
	}
	.checkbox-wrapper-8 .tgl + .tgl-btn {
		outline: 0;
		display: block;
		width: 4em;
		height: 2em;
		position: relative;
		cursor: pointer;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	.checkbox-wrapper-8 .tgl + .tgl-btn:after,
	.checkbox-wrapper-8 .tgl + .tgl-btn:before {
		position: relative;
		display: block;
		content: '';
		width: 50%;
		height: 100%;
	}
	.checkbox-wrapper-8 .tgl + .tgl-btn:after {
		left: 0;
	}
	.checkbox-wrapper-8 .tgl + .tgl-btn:before {
		display: none;
	}
	.checkbox-wrapper-8 .tgl:checked + .tgl-btn:after {
		left: 50%;
	}

	.checkbox-wrapper-8 .tgl-skewed + .tgl-btn {
		overflow: hidden;
		transform: skew(-10deg);
		-webkit-backface-visibility: hidden;
		backface-visibility: hidden;
		transition: all 0.2s ease;
		font-family: sans-serif;
		background: #86d993;
	}
	.checkbox-wrapper-8 .tgl-skewed + .tgl-btn:after,
	.checkbox-wrapper-8 .tgl-skewed + .tgl-btn:before {
		transform: skew(10deg);
		display: inline-block;
		transition: all 0.2s ease;
		width: 100%;
		text-align: center;
		position: absolute;
		line-height: 2em;
		font-weight: bold;
		color: #fff;
		text-shadow: 0 1px 0 rgba(0, 0, 0, 0.4);
	}
	.checkbox-wrapper-8 .tgl-skewed + .tgl-btn:after {
		left: 100%;
		content: attr(data-tg-on);
	}
	.checkbox-wrapper-8 .tgl-skewed + .tgl-btn:before {
		left: 0;
		content: attr(data-tg-off);
	}
	.checkbox-wrapper-8 .tgl-skewed + .tgl-btn:active {
		background: #888;
	}
	.checkbox-wrapper-8 .tgl-skewed + .tgl-btn:active:before {
		left: -10%;
	}
	.checkbox-wrapper-8 .tgl-skewed:checked + .tgl-btn {
		background: #888;
	}
	.checkbox-wrapper-8 .tgl-skewed:checked + .tgl-btn:before {
		left: -100%;
	}
	.checkbox-wrapper-8 .tgl-skewed:checked + .tgl-btn:after {
		left: 0;
	}
	.checkbox-wrapper-8 .tgl-skewed:checked + .tgl-btn:active:after {
		left: 10%;
	}
</style>