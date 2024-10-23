import type { ListOption } from '$lib/Models/Common/ListOption';
import type { CardEntity } from '$lib/Models/Entities/Card';
import { Store } from '$lib/Models/Response/Store';
import { CardRepository } from '$lib/Repositories/Implementation/Card';
import type { InsertCard, UpdateCard } from '$lib/Supabase/Types/database.types';
import { _ } from 'svelte-i18n';
import { get, writable } from 'svelte/store';

const cardRepository = new CardRepository();

const createCardStore = () => {
	const { subscribe, set, update } = writable<Store<CardEntity>>(new Store<CardEntity>());

	return {
		subscribe,
		fetch: async (id: number) => {
			const response = await cardRepository.getCardAsync(id);
			return response;
		},
		fetchAll: async (_options?: ListOption) => {
			const response = await cardRepository.getCardsAsync(_options);
			const pages = Math.ceil(response.count! / (_options?.limit ?? 10));
			set({
				data: response.data ?? [],
				total: response.count!,
				pages: pages,
				limit: _options?.limit ?? 10,
				remainingData: response.data?.length
			});
			return {
				data: response.data ?? [],
				total: response.count!,
				pages: pages,
				limit: _options?.limit ?? 10,
				remainingData: response.data?.length
			};
		},
		insert: async (card: InsertCard) => {
			if (!card.title || card.title == 0) {
				throw new Error(get(_)('title-is-required'));
			}
			const response = await cardRepository.createCardAsync(card);
			update((cards) => ({
				...cards,
				data: [...cards.data, response],
				remainingData: cards.remainingData! - 1
			}));
			return response;
		},
		put: async (card: UpdateCard) => {
			const response = await cardRepository.updateCardAsync(card);
			update((cards) => ({
				...cards,
				data: cards.data.map((c) => (c.id === response.id ? response : c)),
				remainingData: cards.remainingData! - 1
			}));
		},
		remove: async (id: number) => {
			await cardRepository.deleteCardAsync(id);
			update((cards) => ({
				...cards,
				data: cards.data.filter((c) => c.id !== id),
				remainingData: cards.remainingData! - 1
			}));
		}
	};
};

export const cardStore = createCardStore();
