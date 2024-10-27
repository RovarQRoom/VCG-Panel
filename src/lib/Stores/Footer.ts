import type { FooterEntity } from '$lib/Models/Entities/Footer';
import { FooterRepository } from '$lib/Repositories/Implementation/Footer';
import type { Footer, InsertFooter, UpdateFooter } from '$lib/Supabase/Types/database.types';
import { writable } from 'svelte/store';

const footerRepository = new FooterRepository();

const createFooterStore = () => {
	const { subscribe, set, update } = writable<FooterEntity | null>(null);

	return {
		subscribe,
		fetch: async (id: number) => {
			const response = await footerRepository.getFooterAsync(id);
			return response;
		},
		fetchAll: async () => {
			const response = await footerRepository.getFootersAsync();
			return response;
		},
		fetchLatest: async () => {
			const response = await footerRepository.getLatestFooterAsync();
			set(response);
			return response;
		},
		insert: async (footer: InsertFooter) => {
			const response = await footerRepository.createFooterAsync(footer);
			return response;
		},
		put: async (footer: UpdateFooter) => {
			const response = await footerRepository.updateFooterAsync(footer);
			return response;
		},
		remove: async (id: number) => {
			await footerRepository.deleteFooterAsync(id);
		}
	};
};

export const footerStore = createFooterStore();
