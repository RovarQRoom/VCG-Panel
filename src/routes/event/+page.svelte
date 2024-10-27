<script lang="ts">
	import { Card, Button, Label, Input, Tabs, TabItem } from 'flowbite-svelte';
	import { PencilSquare, DocumentCheck } from 'svelte-heros-v2';
	import { TicketSolid, CashSolid, EnvelopeOpenSolid } from 'flowbite-svelte-icons';
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { eventStore } from '$lib/Stores/Event';
	import { languageStore } from '$lib/Stores/Language';
	import {
		LanguageEnum,
		type UpdateEvent,
		type Language
	} from '$lib/Supabase/Types/database.types';
	import moment from 'moment';
	import { toastStore } from '$lib/Stores/Toast';

	let placeLanguage: { en: string; ckb?: string; ar?: string } = { en: '' };
	let event: UpdateEvent = {};
	let dateTime: string = '';
	let ticketType: string = '';

	let isEditing = false;

	onMount(async () => {
		const response = await eventStore.fetchLatest();
		if ($eventStore) {
			placeLanguage = {
				en: response.place?.en || '',
				ckb: response.place?.ckb || '',
				ar: response.place?.ar || ''
			};
			event.id = response.id;
			event.place = response.place?.id;
			event.ticket = response.ticket;
			dateTime = moment(response.date).format('YYYY-MM-DDTHH:mm');
			ticketType = response.ticket || '';
		}
	});

	function toggleEdit() {
		isEditing = !isEditing;
	}

	async function handleSave() {
		isEditing = false;
		let placeResponse: Language | null = null;
		try {
			placeResponse = await languageStore.insert(placeLanguage);
			event.place = placeResponse.id;
			event.date = new Date(dateTime).toISOString();
			event.ticket = ticketType;

			if (!event.place || !event.date) {
				throw new Error('Place and date are required');
			}

			event.id
				? await eventStore.put(event as Required<UpdateEvent>)
				: await eventStore.insert(event as Required<UpdateEvent>);
		} catch (error) {
			console.error(error);
			if (placeResponse && placeResponse.id) {
				await languageStore.remove(placeResponse.id);
			}
			if (error instanceof Error) {
				toastStore.showToast(error.message, 'error');
			} else {
				toastStore.showToast($_('unknown-error-occurred'), 'error');
			}
		}
	}
</script>

<div class="container mx-auto px-4 py-8">
	<Card class="max-w-4xl mx-auto p-4 sm:p-6 bg-white dark:bg-main-dark shadow-lg rounded-lg">
		<div class="flex mb-4 justify-between items-center">
			<h1 class="text-2xl font-bold text-gray-800">{$_('event-details')}</h1>
			<div class="flex space-x-2">
				{#if isEditing}
					<Button on:click={handleSave} class="px-2 py-2 rounded-full" color="green">
						<DocumentCheck size="20" />
					</Button>
				{/if}
				<Button on:click={toggleEdit} class="px-2 py-2 rounded-full">
					<PencilSquare size="20" class={isEditing ? 'text-gray-300' : ''} />
				</Button>
			</div>
		</div>

		<div class="space-y-6">
			<div>
				<Label for="date-time" class="mb-2">{$_('date-and-time')}</Label>
				<Input
				class="bg-input-light dark:bg-input-dark border-0"
					type="datetime-local"
					id="date-time"
					bind:value={dateTime}
					disabled={!isEditing}
					required
				/>
			</div>

			<Tabs style="pills" class="justify-center mb-6">
				{#each Object.keys(LanguageEnum).filter((key) => key !== 'ARABIC') as key}
					<TabItem open={key === 'ENGLISH'} title={$_(key.toLowerCase())}>
						<div class="mt-4">
							<Label for="place-{key.toLowerCase()}" class="mb-2"
								>{$_('place')} ({$_(key.toLowerCase())})</Label
							>
							<Input
							class="bg-input-light dark:bg-input-dark border-0"
								type="text"
								id="place-{key.toLowerCase()}"
								placeholder={$_('enter-event-place')}
								bind:value={placeLanguage[
									key === 'ENGLISH'
										? 'en'
										: key === 'KURDISH'
											? 'ckb'
											: key === 'ARABIC'
												? 'ar'
												: 'en'
								]}
								disabled={!isEditing}
								required={key === 'ENGLISH'}
							/>
						</div>
					</TabItem>
				{/each}
			</Tabs>

			<div>
				<Label class="mb-2">{$_('ticket-type')}</Label>
				<div class="flex space-x-4">
					<label class="flex-1">
						<input
							type="radio"
							name="ticket"
							value="free"
							bind:group={ticketType}
							disabled={!isEditing}
							class="hidden peer"
						/>
						<div
							class="flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 peer-checked:border-blue-600 peer-checked:bg-blue-50 hover:bg-gray-50"
						>
							<TicketSolid class="w-8 h-8 mb-2 text-gray-500 peer-checked:text-blue-600" />
							<span class="text-sm font-medium">{$_('free')}</span>
						</div>
					</label>
					<label class="flex-1">
						<input
							type="radio"
							name="ticket"
							value="paid"
							bind:group={ticketType}
							disabled={!isEditing}
							class="hidden peer"
						/>
						<div
							class="flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 peer-checked:border-blue-600 peer-checked:bg-blue-50 hover:bg-gray-50"
						>
							<CashSolid class="w-8 h-8 mb-2 text-gray-500 peer-checked:text-blue-600" />
							<span class="text-sm font-medium">{$_('paid')}</span>
						</div>
					</label>
					<label class="flex-1 flex-row">
						<input
							type="radio"
							name="ticket"
							value="invitation"
							bind:group={ticketType}
							disabled={!isEditing}
							class="hidden peer"
						/>
						<div
							class="flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 peer-checked:border-blue-600 peer-checked:bg-blue-50 hover:bg-gray-50"
						>
							<EnvelopeOpenSolid class="w-8 h-8 mb-2 text-gray-500 peer-checked:text-blue-600" />
							<span class="text-sm font-medium">{$_('invitation-only')}</span>
						</div>
					</label>
				</div>
			</div>
		</div>
	</Card>
</div>
