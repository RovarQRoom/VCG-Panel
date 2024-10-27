import type { ListOption } from '$lib/Models/Common/ListOption';
import { Store } from '$lib/Models/Response/Store';
import { SocialRepository } from '$lib/Repositories/Implementation/Social';
import type { InsertSocial, Social, UpdateSocial } from '$lib/Supabase/Types/database.types';
import { writable } from 'svelte/store';

const socialRepository = new SocialRepository();

const createSocialStore = () => {
	const { subscribe, set, update } = writable<Store<Social>>(new Store<Social>());

	return {
		subscribe,
		insert: async (social: InsertSocial) => {
			const response = await socialRepository.createSocialAsync(social);
			update((store) => {
				store.data.push(response);
				return store;
			});
			return response;
		},
		bulkInsert: async (socials: InsertSocial[]) => {
			// delete all socials
			if (socials.length > 0) {
				// if id is not null, delete it
				const ids = socials.filter((s) => s.id !== null).map((s) => s.id?.toString() ?? '');
				if (ids.length > 0) {
					await socialRepository.deleteSocialsAsync(ids);
				}
			}
			const response = await socialRepository.createSocialsAsync(socials);
			update((store) => {
				store.data.push(...response);
				return store;
			});
			return response;
		},
		fetchAll: async (option?: ListOption) => {
			const response = await socialRepository.getSocialsAsync(option);
			const pages = Math.ceil((response.count ?? 0) / (option?.limit ?? 10));
			set({
				data: response.data ?? [],
				total: response.count ?? 0,
				pages,
				remainingData: (response.count ?? 0) - (option?.page ?? 1) * (option?.limit ?? 10)
			});
			return response;
		},
		fetch: async (id: number) => {
			const response = await socialRepository.getSocialAsync(id);
			return response;
		},
		put: async (social: UpdateSocial) => {
			const response = await socialRepository.updateSocialAsync(social);
			update((store) => {
				const index = store.data.findIndex((s) => s.id === social.id);
				if (index !== -1) {
					store.data[index] = response;
				}
				return store;
			});
			return response;
		},
		remove: async (id: number) => {
			await socialRepository.deleteSocialAsync(id);
			update((store) => {
				store.data = store.data.filter((s) => s.id !== id);
				return store;
			});
		}
	};
};

export const socialStore = createSocialStore();
