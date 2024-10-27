import type { ListOption } from '$lib/Models/Common/ListOption';
import { Store } from '$lib/Models/Response/Store';
import { RegisterRepository } from '$lib/Repositories/Implementation/Register';
import type { InsertRegister, Register, UpdateRegister } from '$lib/Supabase/Types/database.types';
import { writable } from 'svelte/store';

const registerRepository = new RegisterRepository();

const createRegisterStore = () => {
	const { subscribe, set, update } = writable<Store<Register>>(new Store<Register>());

	return {
		subscribe,
		fetch: async (id: number) => {
			const response = await registerRepository.getRegisterAsync(id);
			return response;
		},
		fetchAll: async (_options?: ListOption) => {
			const response = await registerRepository.getRegistersAsync(_options);
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
		insert: async (register: InsertRegister) => {
			const response = await registerRepository.createRegisterAsync(register);
			update((registers) => ({
				...registers,
				data: [...registers.data, response],
				remainingData: registers.remainingData! - 1
			}));
			return response;
		},
		put: async (register: UpdateRegister) => {
			const response = await registerRepository.updateRegisterAsync(register);
			update((registers) => ({
				...registers,
				data: registers.data.map((r) => (r.id === response.id ? response : r)),
				remainingData: registers.remainingData! - 1
			}));
		},
		remove: async (id: number) => {
			await registerRepository.deleteRegisterAsync(id);
			update((registers) => ({
				...registers,
				data: registers.data.filter((r) => r.id !== id),
				remainingData: registers.remainingData! - 1
			}));
		}
	};
};

export const registerStore = createRegisterStore();
