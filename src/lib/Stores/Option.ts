import type { ListOption } from '$lib/Models/Common/ListOption';
import type { OptionEntity } from '$lib/Models/Entities/Option';
import { Store } from '$lib/Models/Response/Store';
import { OptionRepository } from '$lib/Repositories/Implementation/Option';
import type { InsertOption, UpdateOption } from '$lib/Supabase/Types/database.types';
import { _ } from 'svelte-i18n';
import { get, writable } from 'svelte/store';
import { toastStore } from './Toast';

const optionRepository = new OptionRepository();

const createOptionStore = () => {
	const { subscribe, set, update } = writable<Store<OptionEntity>>(new Store<OptionEntity>());

	return {
		subscribe,
		set: (value: Store<OptionEntity>) => set(value),
		update: (fn: (value: Store<OptionEntity>) => Store<OptionEntity>) => update(fn),
		fetch: async (id: number) => {
			const response = await optionRepository.getOptionAsync(id);
			return response;
		},
		fetchBySettingId: async (setting_id: number) => {
			const response = await optionRepository.getOptionsBySettingIdAsync(setting_id);

			return response;
		},
		fetchAll: async (_options?: ListOption) => {
			const response = await optionRepository.getOptionsAsync(_options);
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
		insert: async (option: InsertOption) => {
			try {
				if (!option.field) {
					throw new Error(get(_)('field-is-required'));
				}
				const response = await optionRepository.createOptionAsync(option);
				update((options) => ({
					...options,
					data: [response, ...options.data],
					remainingData: options.remainingData! - 1
				}));
				toastStore.showToast(get(_)('option-created-successfully'), 'success');
				return response;
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
		put: async (option: UpdateOption) => {
			try {
				const response = await optionRepository.updateOptionAsync(option);
				update((options) => ({
					...options,
					data: options.data.map((o) => (o.id === response.id ? response : o)),
					remainingData: options.remainingData! - 1
				}));
				toastStore.showToast(get(_)('option-updated-successfully'), 'success');
				return response;
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
		remove: async (id: number) => {
			try {
				await optionRepository.deleteOptionAsync(id);
				update((options) => ({
					...options,
					data: options.data.filter((o) => o.id !== id),
					remainingData: options.remainingData! - 1
				}));
				toastStore.showToast(get(_)('option-deleted-successfully'), 'success');
			} catch (error) {
				console.error(error);
				throw error;
			}
		}
	};
};

export const optionStore = createOptionStore();
