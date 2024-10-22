import { FooterRepository } from '$lib/Repositories/Implementation/Footer';
import type { Footer, InsertFooter, UpdateFooter } from '$lib/Supabase/Types/database.types';
import { writable } from 'svelte/store';

const footerRepository = new FooterRepository();

const createFooterStore = () => {
	const { subscribe, set, update } = writable<Footer[]>([]);

	return {
		subscribe,
		fetch: async (id: number) => {
			const response = await footerRepository.getFooterAsync(id);
			return response;
		},
		fetchAll: async () => {
			const response = await footerRepository.getFootersAsync();
			set(response);
		},
		insert: async (footer: InsertFooter) => {
			const response = await footerRepository.createFooterAsync(footer);
			update((footers) => [...footers, response]);
		},
		put: async (footer: UpdateFooter) => {
			const response = await footerRepository.updateFooterAsync(footer);
			update((footers) => footers.map((f) => (f.id === response.id ? response : f)));
		},
		remove: async (id: number) => {
			await footerRepository.deleteFooterAsync(id);
			update((footers) => footers.filter((f) => f.id !== id));
		}
	};
};

export const footerStore = createFooterStore();
