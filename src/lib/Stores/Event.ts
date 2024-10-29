import type { EventEntity } from '$lib/Models/Entities/Event';
import { EventRepository } from '$lib/Repositories/Implementation/Event';
import type { InsertEvent, UpdateEvent } from '$lib/Supabase/Types/database.types';
import { get, writable } from 'svelte/store';
import { toastStore } from './Toast';
import { _ } from 'svelte-i18n';

const eventRepository = new EventRepository();

const createEventStore = () => {
	const { subscribe, set, update } = writable<EventEntity | null>(null);

	return {
		subscribe,
		fetch: async (id: number) => {
			const response = await eventRepository.getEventAsync(id);
			return response;
		},
		fetchAll: async () => {
			const response = await eventRepository.getEventsAsync();
			return response;
		},
		fetchLatest: async () => {
			const response = await eventRepository.getLatestEventAsync();
			set(response);
			return response;
		},
		insert: async (event: InsertEvent) => {
			try {
				const response = await eventRepository.createEventAsync(event);
				toastStore.showToast(get(_)('event-created-successfully'), 'success');
				return response;
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
		put: async (event: UpdateEvent) => {
			try {
				const response = await eventRepository.updateEventAsync(event);
				toastStore.showToast(get(_)('event-updated-successfully'), 'success');
				set(response);
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
		remove: async (id: number) => {
			try {
				await eventRepository.deleteEventAsync(id);
				toastStore.showToast(get(_)('event-deleted-successfully'), 'success');
				set(null);
			} catch (error) {
				console.error(error);
				throw error;
			}
		}
	};
};

export const eventStore = createEventStore();
