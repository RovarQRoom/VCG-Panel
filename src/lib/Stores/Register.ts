import { RegisterRepository } from '$lib/Repositories/Implementation/Register';
import type { InsertRegister, Register, UpdateRegister } from '$lib/Supabase/Types/database.types';
import { writable } from 'svelte/store';

const registerRepository = new RegisterRepository();

const createRegisterStore = () => {
	const { subscribe, set, update } = writable<Register[]>([]);

	return {
		subscribe,
		fetch: async (id: number) => {
			const response = await registerRepository.getRegisterAsync(id);
			return response;
		},
		fetchAll: async () => {
			const response = await registerRepository.getRegistersAsync();
			set(response);
		},
		insert: async (register: InsertRegister) => {
			const response = await registerRepository.createRegisterAsync(register);
			update((registers) => [...registers, response]);
		},
		put: async (register: UpdateRegister) => {
			const response = await registerRepository.updateRegisterAsync(register);
			update((registers) => registers.map((r) => (r.id === response.id ? response : r)));
		},
		remove: async (id: number) => {
			await registerRepository.deleteRegisterAsync(id);
			update((registers) => registers.filter((r) => r.id !== id));
		}
	};
};

export const registerStore = createRegisterStore();
