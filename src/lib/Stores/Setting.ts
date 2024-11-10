import type { ListOption } from '$lib/Models/Common/ListOption';
import type { SettingEntity } from '$lib/Models/Entities/Setting';
import { Store } from '$lib/Models/Response/Store';
import { SettingRepository } from '$lib/Repositories/Implementation/Setting';
import type { InsertSetting, UpdateSetting } from '$lib/Supabase/Types/database.types';
import { _ } from 'svelte-i18n';
import { get, writable } from 'svelte/store';
import { toastStore } from './Toast';

const settingRepository = new SettingRepository();

const createSettingStore = () => {
    const { subscribe, set, update } = writable<Store<SettingEntity>>(new Store<SettingEntity>());

    return {
        subscribe,
        fetch: async (id: number) => {
            const response = await settingRepository.getSettingAsync(id);
            return response;
        },
        fetchAll: async (_options?: ListOption) => {
            const response = await settingRepository.getSettingsAsync(_options);
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
        insert: async (setting: InsertSetting) => {
            try {
                const response = await settingRepository.createSettingAsync(setting);
                update((settings) => ({
                    ...settings,
                    data: [...settings.data, response],
                    remainingData: settings.remainingData! - 1
                }));
                toastStore.showToast(get(_)('setting-created-successfully'), 'success');
                return response;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        put: async (setting: UpdateSetting) => {
            try {
                const response = await settingRepository.updateSettingAsync(setting);
                update((settings) => ({
                    ...settings,
                    data: settings.data.map((s) => (s.id === response.id ? response : s)),
                    remainingData: settings.remainingData! - 1
                }));
                toastStore.showToast(get(_)('setting-updated-successfully'), 'success');
                return response;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        remove: async (id: number) => {
            try {
                await settingRepository.deleteSettingAsync(id);
                update((settings) => ({
                    ...settings,
                    data: settings.data.filter((s) => s.id !== id),
                    remainingData: settings.remainingData! - 1
                }));
                toastStore.showToast(get(_)('setting-deleted-successfully'), 'success');
            } catch (error) {
                console.error(error);
                throw error;
            }
        }
    };
};

export const settingStore = createSettingStore(); 