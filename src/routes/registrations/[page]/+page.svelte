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
		Badge
	} from 'flowbite-svelte';
	import { CheckCircleSolid, CircleMinusSolid, TrashBinOutline } from 'flowbite-svelte-icons';
	import { registerStore } from '$lib/Stores/Register';
	import { _ } from 'svelte-i18n';
	import Pagination from '$lib/Components/Pagination.svelte';
	import type { ListOption } from '$lib/Models/Common/ListOption';
	import { page } from '$app/stores';
	import { toastStore } from '$lib/Stores/Toast';

	let filter: ListOption = {
		page: 1,
		limit: 9
	};

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
				return 'blue';
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
</script>

<div class="p-4">
	<h1 class="text-3xl font-bold mb-6">{$_('registrations')}</h1>

	<div class="overflow-x-auto relative shadow-md sm:rounded-lg">
		<Table hoverable={true}>
			<TableHead class="bg-main-dark dark:bg-input-dark text-white">
				<TableHeadCell>{$_('name')}</TableHeadCell>
				<TableHeadCell>{$_('email')}</TableHeadCell>
				<TableHeadCell>{$_('phone')}</TableHeadCell>
				<TableHeadCell>{$_('language')}</TableHeadCell>
				<TableHeadCell>{$_('created-at')}</TableHeadCell>
				<TableHeadCell>{$_('trading_knowledge')}</TableHeadCell>
				<TableHeadCell>{$_('trade_priority')}</TableHeadCell>
				<TableHeadCell>{$_('traded_before')}</TableHeadCell>
				<TableHeadCell>{$_('trading_from')}</TableHeadCell>
				<TableHeadCell>{$_('monthly_income')}</TableHeadCell>
				<TableHeadCell>{$_('goal_income')}</TableHeadCell>
				<TableHeadCell>{$_('actions')}</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each $registerStore.data as registration}
					<TableBodyRow
						class="bg-input-light border-white dark:bg-main-dark dark:border-input-dark"
					>
						<TableBodyCell>{registration.name}</TableBodyCell>
						<TableBodyCell>{registration.email}</TableBodyCell>
						<TableBodyCell>{registration.phone}</TableBodyCell>
						<TableBodyCell>
							<Badge class="w-20 py-1  " color={getLanguageBadge(registration.language)}>
								{registration.language}
							</Badge>
						</TableBodyCell>
						<TableBodyCell>{new Date(registration.created_at).toLocaleString()}</TableBodyCell>
						<TableBodyCell>{registration.trading_knowledge ?? $_('no-data')}</TableBodyCell>
						<TableBodyCell>{registration.trade_priority ?? $_('no-data')}</TableBodyCell>
						<TableBodyCell>{registration.traded_before ?? $_('no-data')}</TableBodyCell>
						<TableBodyCell>{registration.trading_from ?? $_('no-data')}</TableBodyCell>
						<TableBodyCell>{registration.monthly_income ?? $_('no-data')}</TableBodyCell>
						<TableBodyCell>{registration.goal_income ?? $_('no-data')}</TableBodyCell>
						<TableBodyCell>
							<div class="flex space-x-2 gap-3">
								{#if registration.action === null}
									<Button size="xs" color="green" on:click={() => handleAccept(registration.id)}>
										<CheckCircleSolid class="mr-2 h-4 w-4" />
										{$_('accept')}
									</Button>
									<Button size="xs" color="red" on:click={() => handleReject(registration.id)}>
										<CircleMinusSolid class="mr-2 h-4 w-4" />
										{$_('reject')}
									</Button>
								{:else if registration.action === true}
									<Badge color="green" class="w-24 rounded-3xl">{$_('accepted')}</Badge>
								{:else}
									<Badge color="red" class="w-24 rounded-3xl">{$_('rejected')}</Badge>
								{/if}
								<Button
									size="xs"
									color="light"
									class="hover:bg-red-100 transition-colors duration-300 rounded-full p-2"
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
