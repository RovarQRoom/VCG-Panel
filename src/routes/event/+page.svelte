<script lang="ts">
	import { Card, Button, Label, Input, Tabs, TabItem } from 'flowbite-svelte';
	import { PencilSquare, DocumentCheck, Trash } from 'svelte-heros-v2';
	import { ComputerSpeakerSolid, CashSolid, AwardSolid } from 'flowbite-svelte-icons';
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
		await eventStore.fetchLatest();
		if ($eventStore) {
			placeLanguage = {
				en: $eventStore.place?.en || '',
				ckb: $eventStore.place?.ckb || '',
				ar: $eventStore.place?.ar || ''
			};
			event.id = $eventStore.id;
			event.place = $eventStore.place?.id;
			event.ticket = $eventStore.ticket;
			dateTime = moment($eventStore.date).format('YYYY-MM-DDTHH:mm');
			ticketType = $eventStore.ticket || '';
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
				toastStore.showToast($_('place-and-date-are-required'), 'warning');
				throw new Error($_('place-and-date-are-required'));
			}

			event.id
				? await eventStore.put(event as Required<UpdateEvent>)
				: await eventStore.insert(event as Required<UpdateEvent>);
			await eventStore.fetchLatest();
			if ($eventStore) {
				placeLanguage = {
					en: $eventStore.place?.en || '',
					ckb: $eventStore.place?.ckb || '',
					ar: $eventStore.place?.ar || ''
				};
				event.id = $eventStore.id;
				event.place = $eventStore.place?.id;
				event.ticket = $eventStore.ticket;
				dateTime = moment($eventStore.date).format('YYYY-MM-DDTHH:mm');
				ticketType = $eventStore.ticket || '';
			}
		} catch (error) {
			if (placeResponse && placeResponse.id) {
				await languageStore.remove(placeResponse.id);
			}
			if (error instanceof Error) {
				toastStore.showToast(error.message, 'error');
			} else {
				toastStore.showToast($_('unknown-error-occurred'), 'error');
			}
			placeLanguage = { en: '' };
			event = {};
			dateTime = '';
			ticketType = '';
		}
	}

	async function handleDelete() {
		try {
			if (event.id) {
				await eventStore.remove(event.id);
				placeLanguage = { en: '' };
				event = {};
				dateTime = '';
				ticketType = '';
			}
			isEditing = false;
		} catch (error) {
			console.error(error);
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
			<div class="flex gap-2">
				{#if isEditing}
					<Button on:click={handleSave} class="px-2 py-2 rounded-full" color="green">
						<DocumentCheck size="20" />
					</Button>
					<Button on:click={handleDelete} class="px-2 py-2 rounded-full" color="red">
						<Trash size="20" />
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
				<div class="flex gap-2 {isEditing ? '' : 'opacity-50 cursor-not-allowed'}">
					<label class="w-full">
						<input
							type="radio"
							name="ticket"
							value="online"
							bind:group={ticketType}
							disabled={!isEditing}
							class="hidden peer"
							on:click={() => ticketType === 'online' ? ticketType = '' : null}
						/>
						<div
							class="flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 peer-checked:border-darkBlue peer-checked:bg-blue hover:bg-gray-50"
						>
							<ComputerSpeakerSolid class="w-8 h-8 mb-2 text-gray-500 peer-checked:text-blue" />
							<span class="text-sm font-medium">{$_('online')}</span>
						</div>
					</label>
					<label class="w-full">
						<input
							type="radio"
							name="ticket"
							value="paid"
							bind:group={ticketType}
							disabled={!isEditing}
							class="hidden peer"
							on:click={() => ticketType === 'paid' ? ticketType = '' : null}
						/>
						<div
							class="flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 peer-checked:border-darkBlue peer-checked:bg-blue hover:bg-gray-50"
						>
							<CashSolid class="w-8 h-8 mb-2 text-gray-500 peer-checked:text-blue" />
							<span class="text-sm font-medium">{$_('paid')}</span>
						</div>
					</label>
					<label class="w-full flex-row">
						<input
							type="radio"
							name="ticket"
							value="lifetime_support"
							bind:group={ticketType}
							disabled={!isEditing}
							class="hidden peer"
							on:click={() => ticketType === 'lifetime_support' ? ticketType = '' : null}
						/>
						<div
							class="flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 peer-checked:border-darkBlue peer-checked:bg-blue hover:bg-gray-50"
						>
							<AwardSolid class="w-8 h-8 mb-2 text-gray-500 peer-checked:text-blue" />
							<span class="text-sm font-medium">{$_('lifetime-support')}</span>
						</div>
					</label>
				</div>
			</div>
		</div>
	</Card>
</div>
