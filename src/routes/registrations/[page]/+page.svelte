<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Button,
		GradientButton,
		Badge,
		Modal,
		Label,
		Input,
		Spinner,
		type ColorVariant
	} from 'flowbite-svelte';
	import {
		CheckCircleSolid,
		CircleMinusSolid,
		TrashBinOutline,
		PrinterSolid
	} from 'flowbite-svelte-icons';
	import { registerStore } from '$lib/Stores/Register';
	import { _ } from 'svelte-i18n';
	import Pagination from '$lib/Components/Pagination.svelte';
	import type { ListOption } from '$lib/Models/Common/ListOption';
	import { page } from '$app/stores';
	import { toastStore } from '$lib/Stores/Toast';
	import { exportToExcel } from '$lib/utils/exportToExcel';
	import type { Knowledge } from '$lib/Supabase/Types/database.types';

	let filter: ListOption = {
		page: 1,
		limit: 9
	};

	let excelOption = {
		from: 1,
		to: 100
	};

	let showExportModal = false;
	let isExporting = false;

	onMount(async () => {
		await fetchRegistrations();
	});

	async function handleAccept(id: number) {
		await registerStore.put({
			id,
			action: true
		});
	}

	async function handleReject(id: number) {
		await registerStore.put({
			id,
			action: false
		});
	}

	function getLanguageBadge(
		language: string
	):
		| 'none'
		| 'red'
		| 'yellow'
		| 'green'
		| 'purple'
		| 'blue'
		| 'dark'
		| 'primary'
		| 'indigo'
		| 'pink' {
		switch (language) {
			case 'ENGLISH':
				return 'indigo';
			case 'ARABIC':
				return 'green';
			case 'KURDISH':
				return 'red';
			default:
				return 'primary'; // Changed from 'gray' to 'primary'
		}
	}

	async function fetchRegistrations() {
		try {
			await registerStore.fetchAll(filter);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
			toastStore.showToast(`${$_('failed-to-fetch-registrations')}: ${errorMessage}`, 'error');
		}
	}

	async function deleteRegistration(id: number) {
		try {
			await registerStore.remove(id);
			toastStore.showToast('Registration deleted successfully!', 'success');
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
			toastStore.showToast(`${$_('failed-to-delete-registration')}: ${errorMessage}`, 'error');
		}
	}

	async function handleExport() {
		try {
			isExporting = true;
			const registers = await registerStore.export(excelOption.from, excelOption.to, filter);
			exportToExcel(registers.data ?? [], 'Registrations');
			showExportModal = false;
			toastStore.showToast($_('export-success'), 'success');
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
			toastStore.showToast(`${$_('export-failed')}: ${errorMessage}`, 'error');
		} finally {
			isExporting = false;
		}
	}

	function getCallTimeBadgeColor(callTime: string | null): ColorVariant {
		switch (callTime) {
			case 'AM11_PM02':
				return 'green';
			case 'PM02_PM05':
				return 'yellow';
			case 'PM05_PM08':
				return 'purple';
			default:
				return 'primary';
		}
	}

	function getBooleanBadgeColor(value: boolean | null): string {
		return value
			? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300'
			: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
	}

	function getTradingKnowledgeBadgeColor(value: string | null): ColorVariant {
		switch (value) {
			case 'BEGINNER':
				return 'green';
			case 'INTERMEDIATE':
				return 'yellow';
			case 'ADVANCE':
				return 'purple';
			default:
				return 'primary';
		}
	}
</script>

<div class="p-4 mt-24">
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl font-bold">{$_('registrations')}</h1>
		<button
			on:click={() => (showExportModal = true)}
			class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-sky-600 to-indigo-700 rounded-lg shadow-md hover:from-sky-700 hover:to-indigo-800 focus:ring-4 focus:ring-sky-300 focus:outline-none transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
		>
			<PrinterSolid class="w-4 h-4" />
			<span>{$_('export-to-excel')}</span>
		</button>
	</div>

	<div class="overflow-x-auto relative shadow-md sm:rounded-lg">
		<Table hoverable={true} class="w-full text-sm">
			<TableHead class="bg-main-dark dark:bg-input-dark text-white">
				<TableHeadCell class="px-6 py-4">{$_('name')}</TableHeadCell>
				<TableHeadCell class="px-6 py-4">{$_('email')}</TableHeadCell>
				<TableHeadCell class="px-6 py-4">{$_('phone')}</TableHeadCell>
				<TableHeadCell class="px-6 py-4">{$_('call-time')}</TableHeadCell>
				<TableHeadCell class="px-6 py-4">{$_('created-at')}</TableHeadCell>
				<TableHeadCell class="px-6 py-4">{$_('trading_knowledge')}</TableHeadCell>
				<TableHeadCell class="px-6 py-4">{$_('trade_priority')}</TableHeadCell>
				<TableHeadCell class="px-6 py-4">{$_('traded_before')}</TableHeadCell>
				<TableHeadCell class="px-6 py-4">{$_('service_type')}</TableHeadCell>
				<TableHeadCell class="px-6 py-4">{$_('monthly_income')}</TableHeadCell>
				<TableHeadCell class="px-6 py-4">{$_('goal_income')}</TableHeadCell>
				<TableHeadCell class="px-6 py-4">{$_('actions')}</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each $registerStore.data as registration}
					<TableBodyRow
						class="bg-white dark:bg-main-dark border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
					>
						<TableBodyCell class="px-6 py-4 font-medium">{registration.name}</TableBodyCell>
						<TableBodyCell class="px-6 py-4">{registration.email}</TableBodyCell>
						<TableBodyCell class="px-6 py-4">{registration.phone}</TableBodyCell>
						<TableBodyCell class="px-6 py-4">
							{#if registration.callTime}
								<Badge
									color={getCallTimeBadgeColor(registration.callTime)}
									class="px-3 py-1 text-xs font-medium rounded-full"
								>
									{$_(registration.callTime.toLowerCase())}
								</Badge>
							{:else}
								<span class="text-gray-400">-</span>
							{/if}
						</TableBodyCell>
						<TableBodyCell class="px-6 py-4">
							{new Date(registration.created_at).toLocaleString()}
						</TableBodyCell>
						<TableBodyCell class="px-6 py-4">
							{#if registration.trading_knowledge}
								<Badge
									color={getTradingKnowledgeBadgeColor(registration.trading_knowledge)}
									class="px-3 py-1 text-xs font-medium rounded-full w-24"
								>
									{$_(registration.trading_knowledge.toLowerCase())}
								</Badge>
							{:else}
								<span class="text-gray-400">{$_('no-data')}</span>
							{/if}
						</TableBodyCell>
						<TableBodyCell class="px-6 py-4">
							<span
								class={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getBooleanBadgeColor(registration.trade_priority)} w-12 text-center`}
							>
								{registration.trade_priority ? $_('true') : $_('false')}
							</span>
						</TableBodyCell>
						<TableBodyCell class="px-6 py-4">
							<span
								class={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getBooleanBadgeColor(registration.traded_before)} w-12 text-center`}
							>
								{registration.traded_before ? $_('true') : $_('false')}
							</span>
						</TableBodyCell>
						<TableBodyCell class="px-6 py-4">
							{#if registration.service}
								<Badge color="blue" class="px-3 py-1 text-xs font-medium rounded-full">
									{$_(registration.service.toLowerCase())}
								</Badge>
							{:else}
								<span class="text-gray-400">{$_('no-data')}</span>
							{/if}
						</TableBodyCell>
						<TableBodyCell class="px-6 py-4">
							{registration.monthly_income
								? $_(registration.monthly_income.toLowerCase())
								: $_('no-data')}
						</TableBodyCell>
						<TableBodyCell class="px-6 py-4">
							{registration.goal_income
								? $_(registration.goal_income.toLowerCase())
								: $_('no-data')}
						</TableBodyCell>
						<TableBodyCell class="px-6 py-4">
							<div class="flex space-x-2 gap-3">
								{#if registration.action === null}
									<GradientButton
										shadow
										color="green"
										class="gap-2 text-xs"
										on:click={() => handleAccept(registration.id)}
									>
										<CheckCircleSolid class="h-4 w-4" />
										{$_('accept')}
									</GradientButton>

									<GradientButton
										shadow
										color="red"
										class="gap-2 text-xs"
										on:click={() => handleReject(registration.id)}
									>
										<CircleMinusSolid class="h-4 w-4" />
										{$_('reject')}
									</GradientButton>
								{:else if registration.action === true}
									<Badge color="green" class="px-4 py-1 rounded-full">
										{$_('accepted')}
									</Badge>
								{:else}
									<Badge color="red" class="px-4 py-1 rounded-full">
										{$_('rejected')}
									</Badge>
								{/if}
								<Button
									size="xs"
									color="light"
									class="min-w-10 hover:bg-red-100 transition-colors duration-300 rounded-full p-2 bg-white dark:bg-input-dark dark:hover:bg-[#363636] border-0"
									on:click={() => deleteRegistration(registration.id)}
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
</div>

<div class="flex justify-center mt-8">
	<Pagination
		Store={registerStore}
		currentPage={Number($page.params.page)}
		name={'registrations'}
		{filter}
	/>
</div>

<Modal
	bind:open={showExportModal}
	size="sm"
	class="w-full"
	autoclose={false}
	defaultClass="bg-[#f1f1f1] dark:bg-main-dark"
	backdropClass="bg-white dark:bg-darkBlue backdrop-blur-sm"
>
	<div class="relative p-4">
		<div class="text-center mb-6">
			<h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">
				{$_('export-to-excel')}
			</h3>
			<p class="text-sm text-slate-500 dark:text-slate-400">
				{$_('select-range-to-export')}
			</p>
		</div>

		<div class="space-y-4">
			<div>
				<Label for="from">{$_('from')}</Label>
				<Input
					id="from"
					type="number"
					bind:value={excelOption.from}
					min="1"
					class="mt-1 dark:bg-input-dark border-0"
				/>
			</div>

			<div>
				<Label for="to">{$_('to')}</Label>
				<Input
					id="to"
					type="number"
					bind:value={excelOption.to}
					min={excelOption.from}
					class="mt-1 dark:bg-input-dark border-0"
				/>
			</div>
		</div>

		<div class="flex justify-end gap-3 mt-6">
			<button
				type="button"
				class="px-4 py-2 text-sm font-medium text-slate-500 hover:text-white bg-white dark:bg-[#1a2232] rounded-lg hover:bg-red-500 focus:ring-4 focus:ring-slate-200 duration-300 ease-in-out"
				on:click={() => (showExportModal = false)}
				disabled={isExporting}
			>
				{$_('cancel')}
			</button>

			<button
				type="button"
				class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-sky-600 to-indigo-700 rounded-lg shadow-md hover:from-sky-700 hover:to-indigo-800 focus:ring-4 focus:ring-sky-300 disabled:opacity-50 disabled:cursor-not-allowed"
				on:click={handleExport}
				disabled={isExporting}
			>
				{#if isExporting}
					<Spinner class="mr-2 w-4 h-4" />
					{$_('exporting')}...
				{:else}
					<PrinterSolid class="mr-2 w-4 h-4" />
					{$_('export')}
				{/if}
			</button>
		</div>
	</div>
</Modal>
