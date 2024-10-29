import type { TicketEntity } from '$lib/Models/Entities/Ticket';
import { Store } from '$lib/Models/Response/Store';
import { TicketRepository } from '$lib/Repositories/Implementation/Ticket';
import type { InsertTicket, UpdateTicket } from '$lib/Supabase/Types/database.types';
import { get, writable } from 'svelte/store';
import { toastStore } from './Toast';
import { _ } from 'svelte-i18n';
import type { ListOption } from '$lib/Models/Common/ListOption';

const ticketRepository = new TicketRepository();

const createTicketStore = () => {
	const { subscribe, set, update } = writable<Store<TicketEntity>>(new Store<TicketEntity>());
	return {
		subscribe,
		insert: async (ticket: InsertTicket) => {
			if (!ticket.title || ticket.title == 0) {
				toastStore.showToast(get(_)('ticket-title-required'));
			}
			const response = await ticketRepository.createTicketAsync(ticket);
			update((store) => {
				store.data.push(response);
				store.total = store.total + 1;
				return store;
			});
			toastStore.showToast(get(_)('ticket-created'));
			return response;
		},
		fetch: async (id: number) => {
			const response = await ticketRepository.fetchTicketAsync(id);
			return response;
		},
		fetchAll: async (options?: ListOption) => {
			const response = await ticketRepository.fetchAllTicketsAsync(options);
			return response;
		},
		update: async (ticket: UpdateTicket) => {
			const response = await ticketRepository.updateTicketAsync(ticket);
			update((store) => {
				// find the ticket and update it
				const index = store.data.findIndex((t) => t.id == ticket.id);
				if (index != -1) {
					store.data[index] = response;
				}
				return store;
			});
			toastStore.showToast(get(_)('ticket-updated'));
			return response;
		},
		remove: async (id: number) => {
			const response = await ticketRepository.deleteTicketAsync(id);
			update((store) => {
				store.data = store.data.filter((t) => t.id != id);
				store.total = store.total - 1;
				return store;
			});
			toastStore.showToast(get(_)('ticket-deleted'));
			return response;
		}
	};
};
