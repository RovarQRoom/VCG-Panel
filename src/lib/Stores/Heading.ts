import type { HeadingEntity } from '$lib/Models/Entities/Heading';
import { HeadingRepository } from '$lib/Repositories/Implementation/Heading';
import type { HeadingEnum, InsertHeading, UpdateHeading } from '$lib/Supabase/Types/database.types';
import { _ } from 'svelte-i18n';
import { writable } from 'svelte/store';
import { get } from 'svelte/store';
import { toastStore } from './Toast';

const headingRepository = new HeadingRepository();

const createHeadingStore = () => {
	const { subscribe, set, update } = writable<HeadingEntity | null>(null);

	return {
		subscribe,
		insert: async (heading: InsertHeading) => {
			if (!heading.title || heading.title == 0) {
				toastStore.showToast(get(_)('title-is-required'), 'error');
				throw new Error(get(_)('title-is-required'));
			}
			const response = await headingRepository.createHeadingAsync(heading);
			set(response);
			toastStore.showToast(get(_)('heading-created'), 'success');
			return response;
		},
		fetch: async (id: number) => {
			const response = await headingRepository.getHeadingAsync(id);
			set(response);
			return response;
		},
		fetchByType: async (type: HeadingEnum) => {
			const response = await headingRepository.getHeadingByTypeAsync(type);
			set(response);
			return response;
		},
		put: async (heading: UpdateHeading) => {
			const response = await headingRepository.updateHeadingAsync(heading);
			set(response);
			toastStore.showToast(get(_)('heading-updated'), 'success');
			return response;
		},
		remove: async (id: number) => {
			await headingRepository.deleteHeadingAsync(id);
			set(null);
			toastStore.showToast(get(_)('heading-deleted'), 'success');
		}
	};
};

export const headingStore = createHeadingStore();
