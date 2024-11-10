<script lang="ts">
	import {
		Table,
		TableBody,
		TableBodyRow,
		TableBodyCell,
		TableHead,
		TableHeadCell,
		Img
	} from 'flowbite-svelte';
	import { PenSolid, TrashBinOutline } from 'flowbite-svelte-icons';
	import type { RouteEntity } from '$lib/Models/Entities/Route';
	import { _, locale } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { routeStore } from '$lib/Stores/Route';
	import type { Language } from '$lib/Supabase/Types/database.types';
	import type { ListOption } from '$lib/Models/Common/ListOption';
	import RouteEditModal from './RouteEditModal.svelte';
	import SettingOptionsModal from './SettingOptionsModal.svelte';

	let filter: ListOption = {
		page: 1,
		limit: 10,
		language: $locale ?? 'en'
	};

	let showEditModal = false;
	let selectedRoute: number | null = null;

	let showSettingsModal = false;
	let selectedRouteForSettings: RouteEntity | null = null;

	onMount(async () => {
		await routeStore.fetchAll(filter);
	});

	const handleRouteToggle = async (route: RouteEntity) => {
		route.disabled = !route.disabled;
		await routeStore.put({
			id: route.id,
			disabled: route.disabled
		});
	};

	function getLanguageData(route: Language | null | undefined) {
		return (route?.[($locale ?? 'en') as keyof Language] ?? $_('no-title')).toString();
	}

	const handleDelete = async (route: RouteEntity) => {
		// Implement delete logic
		console.log('Delete route:', route);
	};

	const handleEdit = (route: number) => {
		selectedRoute = route;
		showEditModal = true;
	};

	const handleRowClick = (route: RouteEntity) => {
		selectedRouteForSettings = route;
		showSettingsModal = true;
	};

	let previousLocale = $locale;

	$: {
		if (previousLocale !== $locale) {
			previousLocale = $locale;
			filter.language = $locale ?? 'en';
			routeStore.fetchAll(filter);
		}
	}
</script>

<div class="p-4">
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl font-bold dark:text-white">{$_('route-settings')}</h1>
	</div>

	<div class="overflow-x-auto relative shadow-md sm:rounded-lg">
		<Table hoverable={true}>
			<TableHead class="bg-main-dark dark:bg-input-dark text-white text-center">
				<TableHeadCell>{$_('name')}</TableHeadCell>
				<TableHeadCell>{$_('link')}</TableHeadCell>
				<TableHeadCell>{$_('icon')}</TableHeadCell>
				<TableHeadCell>{$_('status')}</TableHeadCell>
				<TableHeadCell>{$_('actions')}</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each $routeStore.data as route}
					<tr
						class="bg-input-light border-white dark:bg-main-dark dark:border-input-dark transition-colors duration-200 text-center"
						on:click={() => handleRowClick(route)}
					>
						<TableBodyCell>{getLanguageData(route.name)}</TableBodyCell>
						<TableBodyCell dir="ltr">{route.link}</TableBodyCell>
						<TableBodyCell>
							{#if route.icon}
								<Img src={route.icon} alt="icon" class="w-8 h-8 rounded" />
							{:else}
								<span class="text-gray-500 dark:text-gray-400">{$_('no-icon')}</span>
							{/if}
						</TableBodyCell>
						<TableBodyCell>
							<span
								class={`px-3 py-1 rounded-full text-sm font-medium ${
									route.disabled
										? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
										: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
								} transition-colors duration-200`}
							>
								{route.disabled ? $_('disabled-route') : $_('active')}
							</span>
						</TableBodyCell>
						<TableBodyCell>
							<div class="flex items-center space-x-3 justify-center">
								<div class="checkbox-wrapper-8 ml-3">
									<input
										class="tgl tgl-skewed"
										id="cb3-8"
										type="checkbox"
										checked={route.disabled}
										on:click|stopPropagation={() => handleRouteToggle(route)}
									/>
									<label
										class="tgl-btn"
										data-tg-on={$_('disabled-route')}
										data-tg-off={$_('active')}
										for="cb3-8"
									></label>
								</div>

								<button
									class="min-w-10 hover:bg-sky-100 transition-colors duration-300 rounded-full p-2 bg-white dark:bg-input-dark dark:hover:bg-[#363636] border-0 disabled:opacity-50 flex items-center justify-center"
									on:click|stopPropagation={() => handleEdit(route.id)}
								>
									<PenSolid
										class="h-5 w-5 text-sky-500 hover:text-sky-700 transition-colors duration-300"
									/>
								</button>

								<button
									class="min-w-10 hover:bg-red-100 transition-colors duration-300 rounded-full p-2 bg-white dark:bg-input-dark dark:hover:bg-[#363636] border-0 disabled:opacity-50 flex items-center justify-center"
									on:click|stopPropagation={() => handleDelete(route)}
									disabled
								>
									<TrashBinOutline
										class="h-5 w-5 text-red-500 hover:text-red-700 transition-colors duration-300"
									/>
								</button>
							</div>
						</TableBodyCell>
					</tr>
				{/each}
			</TableBody>
		</Table>
	</div>

	<RouteEditModal bind:showModal={showEditModal} route={selectedRoute} />
	<SettingOptionsModal bind:showModal={showSettingsModal} bind:route={selectedRouteForSettings} />
</div>

<style>
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
