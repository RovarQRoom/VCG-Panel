import { LanguageRepository } from '$lib/Repositories/Implementation/Language';
import type { InsertLanguage, Language, UpdateLanguage } from '$lib/Supabase/Types/database.types';
import { writable } from 'svelte/store';

const languageRepository = new LanguageRepository();

const createLanguageStore = () => {
	const { subscribe, set, update } = writable<Language[]>([]);

	return {
		subscribe,
		fetch: async (id: number) => {
			const response = await languageRepository.getLanguageAsync(id);
			return response;
		},
		insert: async (language: InsertLanguage) => {
			const response = await languageRepository.createLanguageAsync(language);
			update((languages) => [...languages, response]);
			return response;
		},
		put: async (language: UpdateLanguage) => {
			const response = await languageRepository.updateLanguageAsync(language);
			update((languages) => languages.map((l) => (l.id === response.id ? response : l)));
			return response;
		},
		remove: async (id: number) => {
			await languageRepository.deleteLanguageAsync(id);
			update((languages) => languages.filter((l) => l.id !== id));
		}
	};
};

export const languageStore = createLanguageStore();
