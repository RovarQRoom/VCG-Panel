<script lang="ts">
	import { onMount } from 'svelte';
	import { Card, Button, Label, Input, Textarea, Tabs, TabItem, Radio } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import {
		LanguageEnum,
		type UpdateEvent,
		type Language
	} from '$lib/Supabase/Types/database.types';
	import { _ } from 'svelte-i18n';
	import { languageStore } from '$lib/Stores/Language';
	import { eventStore } from '$lib/Stores/Event';
	import { page } from '$app/stores';
	import { TicketSolid, CashSolid, EnvelopeOpenSolid } from 'flowbite-svelte-icons';

	let event: UpdateEvent | null = null;
	let placeLanguage: {
		en: string;
		ckb?: string;
		ar?: string;
	} = {
		en: ''
	};

	let dateTime: string = '';
	let ticketType: string = '';

	onMount(async () => {
		const response = await eventStore.fetch(Number($page.params.id));
		event = {
			id: response.id,
			date: response.date,
			place: response.place?.id,
			ticket: response.ticket
		};
		placeLanguage = {
			en: response.place?.en ?? '',
			ckb: response.place?.ckb ?? '',
			ar: response.place?.ar ?? ''
		};
		dateTime = new Date(response.date).toISOString().slice(0, 16);
		ticketType = response.ticket ?? '';
	});

	async function handleUpdate() {
		if (!event) return;

		let placeResponse: Language | null = null;

		try {
			placeResponse = await languageStore.put({
				...placeLanguage,
				id: event.place ?? 0
			});

			const updatedEvent: UpdateEvent = {
				...event,
				date: new Date(dateTime).toISOString(),
				place: placeResponse.id,
				ticket: ticketType
			};

			await eventStore.put(updatedEvent);
			goto('/events');
		} catch (error) {
			console.error(error);
			
			// Revert changes if an error occurs
			if (placeResponse && placeResponse.id) {
				await languageStore.put(placeLanguage);
			}
			
			// Show an error message to the user
			alert('An error occurred while updating the event. Please try again.');
		}
	}

	function goBack() {
		goto('/events');
	}
</script>

<div class="mb-6">
	<Button color="light" on:click={goBack} class="px-4 py-2">
		<svg
			class="w-4 h-4 mr-2"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M10 19l-7-7m0 0l7-7m-7 7h18"
			></path>
		</svg>
		Back
	</Button>
</div>

<h1 class="text-3xl font-bold mb-6">Edit Event</h1>

<Card class="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
	<form on:submit|preventDefault={handleUpdate} class="flex flex-col space-y-6">
		<div>
			<Label for="date-time" class="mb-2">Date and Time</Label>
			<Input type="datetime-local" id="date-time" bind:value={dateTime} required />
		</div>

		<Tabs style="pills" class="justify-center mb-6">
			{#each Object.keys(LanguageEnum) as key}
				<TabItem open title={key}>
					<div class="mt-4">
						<Label for="place-{key.toLowerCase()}" class="mb-2">Place ({key})</Label>
						<Input
							type="text"
							id="place-{key.toLowerCase()}"
							placeholder="Enter event place"
							bind:value={placeLanguage[
								key === 'ENGLISH'
									? 'en'
									: key === 'KURDISH'
										? 'ckb'
										: key === 'ARABIC'
											? 'ar'
											: 'en'
							]}
							required={key === 'ENGLISH'}
						/>
					</div>
				</TabItem>
			{/each}
		</Tabs>

		<div>
			<Label class="mb-2">Ticket Type</Label>
			<div class="flex space-x-4">
				<label class="flex-1">
					<input
						type="radio"
						name="ticket"
						value="free"
						bind:group={ticketType}
						class="hidden peer"
					/>
					<div
						class="flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 peer-checked:border-blue-600 peer-checked:bg-blue-50 hover:bg-gray-50"
					>
						<TicketSolid class="w-8 h-8 mb-2 text-gray-500 peer-checked:text-blue-600" />
						<span class="text-sm font-medium">Free</span>
					</div>
				</label>
				<label class="flex-1">
					<input
						type="radio"
						name="ticket"
						value="paid"
						bind:group={ticketType}
						class="hidden peer"
					/>
					<div
						class="flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 peer-checked:border-blue-600 peer-checked:bg-blue-50 hover:bg-gray-50"
					>
						<CashSolid class="w-8 h-8 mb-2 text-gray-500 peer-checked:text-blue-600" />
						<span class="text-sm font-medium">Paid</span>
					</div>
				</label>
				<label class="flex-1 flex-row">
					<input
						type="radio"
						name="ticket"
						value="invitation"
						bind:group={ticketType}
						class="hidden peer"
					/>
					<div
						class="flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 peer-checked:border-blue-600 peer-checked:bg-blue-50 hover:bg-gray-50"
					>
						<EnvelopeOpenSolid class="w-8 h-8 mb-2 text-gray-500 peer-checked:text-blue-600" />
						<span class="text-sm font-medium">Invitation Only</span>
					</div>
				</label>
			</div>
		</div>

		<div class="flex justify-end">
			<Button
				type="submit"
				class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300 ease-in-out"
			>
				Update Event
			</Button>
		</div>
	</form>
</Card>
