import type { RepresentativeEntity } from '$lib/Models/Entities/Representative';
import { RepresentativeRepository } from '$lib/Repositories/Implementation/Representative';
import type { InsertRepresentative, UpdateRepresentative } from '$lib/Supabase/Types/database.types';
import { writable } from 'svelte/store';

const representativeRepository = new RepresentativeRepository();

const createRepresentativeStore = () => {
    const { subscribe, set, update } = writable<RepresentativeEntity | null>(null);

    return {
        subscribe,
        fetch: async (id: number) => {
            const response = await representativeRepository.getRepresentativeAsync(id);
            return response;
        },
        fetchAll: async () => {
			const response = await representativeRepository.getRepresentativesAsync();
			return response;
		},
		fetchLatest: async () => {
            const response = await representativeRepository.getLatestRepresentativeAsync();
			set(response);
			return response;
		},
		insert: async (representative: InsertRepresentative) => {
			const response = await representativeRepository.createRepresentativeAsync(representative);
			set(response);
			return response;
		},
		put: async (representative: UpdateRepresentative) => {
			const response = await representativeRepository.updateRepresentativeAsync(representative);
			set(response);
			return response;
		},
		remove: async (id: number) => {
			await representativeRepository.deleteRepresentativeAsync(id);
			set(null);
		}
	};
};

export const representativeStore = createRepresentativeStore();