<script lang="ts">
	import {
		Table,
		TableBody,
		TableBodyRow,
		TableBodyCell,
		TableHead,
		TableHeadCell,
		Toggle,
		Img,
		Button
	} from 'flowbite-svelte';
	import { PenSolid, TrashBinOutline } from 'flowbite-svelte-icons';
	import type { RouteEntity } from '$lib/Models/Entities/Route';
	import { _, locale } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { routeStore } from '$lib/Stores/Route';
	import type { Language, UpdateLanguage, UpdateRoute } from '$lib/Supabase/Types/database.types';
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

	const handleRowDoubleClick = (route: RouteEntity) => {
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
			<TableHead class="bg-main-dark dark:bg-input-dark text-white">
				<TableHeadCell>{$_('name')}</TableHeadCell>
				<TableHeadCell>{$_('link')}</TableHeadCell>
				<TableHeadCell>{$_('icon')}</TableHeadCell>
				<TableHeadCell>{$_('status')}</TableHeadCell>
				<TableHeadCell>{$_('actions')}</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each $routeStore.data as route}
					<TableBodyRow
						class="bg-input-light border-white dark:bg-main-dark dark:border-input-dark transition-colors duration-200 cursor-pointer hover:relative group"
						on:dblclick={() => handleRowDoubleClick(route)}
						title={$_('double-click-for-settings')}
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
								{route.disabled ? $_('disabled') : $_('active')}
							</span>
						</TableBodyCell>
						<TableBodyCell>
							<div class="flex items-center space-x-3">
								<Toggle
									checked={!route.disabled}
									on:change={() => handleRouteToggle(route)}
									class="transition-all duration-200"
								/>

								<Button
									size="xs"
									color="light"
									class="min-w-10 hover:bg-sky-100 transition-colors duration-300 rounded-full p-2 bg-white dark:bg-input-dark dark:hover:bg-[#363636] border-0"
									on:click={() => handleEdit(route.id)}
								>
									<PenSolid
										class="h-5 w-5 text-sky-500 hover:text-sky-700 transition-colors duration-300"
									/>
								</Button>

								<Button
									size="xs"
									color="light"
									class="min-w-10 hover:bg-red-100 transition-colors duration-300 rounded-full p-2 bg-white dark:bg-input-dark dark:hover:bg-[#363636] border-0"
									on:click={() => handleDelete(route)}
									disabled
								>
									<TrashBinOutline
										class="h-5 w-5 text-red-500 hover:text-red-700 transition-colors duration-300"
									/>
								</Button>
							</div>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</div>

	<RouteEditModal bind:showModal={showEditModal} route={selectedRoute} />
	<SettingOptionsModal bind:showModal={showSettingsModal} bind:route={selectedRouteForSettings} />
</div>
