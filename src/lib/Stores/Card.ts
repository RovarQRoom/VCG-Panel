import type { CardEntity } from '$lib/Models/Entities/Card';
import { CardRepository } from '$lib/Repositories/Implementation/Card';
import type { InsertCard, UpdateCard } from '$lib/Supabase/Types/database.types';
import { _ } from 'svelte-i18n';
import { get, writable } from 'svelte/store';

const cardRepository = new CardRepository();

const createCardStore = () => {
	const { subscribe, set, update } = writable<CardEntity[]>([]);

	return {
		subscribe,
		fetch: async (id: number) => {
			const response = await cardRepository.getCardAsync(id);
			console.log(response);
			return response;
		},
		fetchAll: async () => {
			const response = await cardRepository.getCardsAsync();
			set(response);
		},
		insert: async (card: InsertCard) => {
			if (!card.title || card.title == 0) {
				throw new Error(get(_)('title-is-required'));
			}
			const response = await cardRepository.createCardAsync(card);
			update((cards) => [...cards, response]);
			return response;
		},
		put: async (card: UpdateCard) => {
			const response = await cardRepository.updateCardAsync(card);
			update((cards) => cards.map((c) => (c.id === response.id ? response : c)));
		},
		remove: async (id: number) => {
			await cardRepository.deleteCardAsync(id);
			update((cards) => cards.filter((c) => c.id !== id));
		}
	};
};

export const cardStore = createCardStore();
