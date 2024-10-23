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
	import { CheckCircleSolid } from 'flowbite-svelte-icons';
	import { registerStore } from '$lib/Stores/Register';
	import type { Register } from '$lib/Supabase/Types/database.types';
	import { _ } from 'svelte-i18n';

	let registrations: Register[] = [];

	onMount(async () => {
		await registerStore.fetchAll();
		registrations = $registerStore;
	});

	function handleAccept(id: number) {
		// Implement accept logic here
		console.log('Accepted registration:', id);
	}

	function handleReject(id: number) {
		// Implement reject logic here
		console.log('Rejected registration:', id);
	}

	async function handleDelete(id: number) {
		await registerStore.remove(id);
		registrations = registrations.filter((reg) => reg.id !== id);
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
</script>

<div class="p-4">
	<h1 class="text-3xl font-bold mb-6">{$_('registrations')}</h1>

	<div class="overflow-x-auto relative shadow-md sm:rounded-lg">
		<Table hoverable={true}>
			<TableHead>
				<TableHeadCell>{$_('name')}</TableHeadCell>
				<TableHeadCell>{$_('email')}</TableHeadCell>
				<TableHeadCell>{$_('phone')}</TableHeadCell>
				<TableHeadCell>{$_('language')}</TableHeadCell>
				<TableHeadCell>{$_('created-at')}</TableHeadCell>
				<TableHeadCell>{$_('actions')}</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each registrations as registration}
					<TableBodyRow>
						<TableBodyCell>{registration.name}</TableBodyCell>
						<TableBodyCell>{registration.email}</TableBodyCell>
						<TableBodyCell>{registration.phone}</TableBodyCell>
						<TableBodyCell>
							<Badge color={getLanguageBadge(registration.language)}>{registration.language}</Badge>
						</TableBodyCell>
						<TableBodyCell>{new Date(registration.created_at).toLocaleString()}</TableBodyCell>
						<TableBodyCell>
							<div class="flex space-x-2">
								<Button size="xs" color="green" on:click={() => handleAccept(registration.id)}>
									<CheckCircleSolid class="mr-2 h-4 w-4" />
									{$_('accept')}
								</Button>
								<Button size="xs" color="red" on:click={() => handleReject(registration.id)}>
									<!-- <CirclePlusSolid class="mr-2 h-4 w-4" /> -->
									{$_('reject')}
								</Button>
								<Button size="xs" color="light" on:click={() => handleDelete(registration.id)}>
									<!-- <TrashSolid class="h-4 w-4" /> -->
								</Button>
							</div>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>
