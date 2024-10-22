import type { EventEntity } from '$lib/Models/Entities/Event';
import { EventRepository } from '$lib/Repositories/Implementation/Event';
import type { InsertEvent, UpdateEvent } from '$lib/Supabase/Types/database.types';
import { writable } from 'svelte/store';

const eventRepository = new EventRepository();

const createEventStore = () => {
	const { subscribe, set, update } = writable<EventEntity[]>([]);

	return {
		subscribe,
		fetch: async (id: number) => {
			const response = await eventRepository.getEventAsync(id);
			return response;
		},
		fetchAll: async () => {
			const response = await eventRepository.getEventsAsync();
			set(response);
		},
		fetchLatest: async () => {
			const response = await eventRepository.getLatestEventAsync();
			return response;
		},
		insert: async (event: InsertEvent) => {
			const response = await eventRepository.createEventAsync(event);
			update((events) => [...events, response]);
			return response;
		},
		put: async (event: UpdateEvent) => {
			const response = await eventRepository.updateEventAsync(event);
			update((events) => events.map((e) => (e.id === response.id ? response : e)));
		},
		remove: async (id: number) => {
			await eventRepository.deleteEventAsync(id);
			update((events) => events.filter((e) => e.id !== id));
		}
	};
};

export const eventStore = createEventStore();
