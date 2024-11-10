import type { ListOption } from '$lib/Models/Common/ListOption';
import type { UserEntity } from '$lib/Models/Entities/User';
import type { UpdatePasswordRequest } from '$lib/Models/Request/Password';
import { Store } from '$lib/Models/Response/Store';
import { UserRepository } from '$lib/Repositories/Implementation/User';
import { get, writable } from 'svelte/store';
import { toastStore } from './Toast';
import { _ } from 'svelte-i18n';

const userRepository = new UserRepository();

const createUserStore = () => {
	const { subscribe, set, update } = writable<Store<UserEntity>>(new Store<UserEntity>());

	return {
		subscribe,
		fetch: async (id: number) => {
			const response = await userRepository.getUserAsync(id);
			return response;
		},
		fetchAll: async (_option?: ListOption) => {
			const response = await userRepository.getUsersAsync(_option);
			const pages = Math.ceil(response.count! / (_option?.limit ?? 10));
			set({
				data: response.data ?? [],
				total: response.count!,
				pages: pages,
				limit: _option?.limit ?? 10,
				remainingData: response.data?.length
			});
			return {
				data: response.data ?? [],
				total: response.count!,
				pages: pages,
				limit: _option?.limit ?? 10,
				remainingData: response.data?.length
			};
		},
		putPassword: async (request: UpdatePasswordRequest) => {
			if (!request.newPassword) {
				toastStore.showToast(get(_)('password-required'));
			}
			if (request.newPassword == request.oldPassword) {
				toastStore.showToast(get(_)('password-same'));
			}
			if (request.newPassword != request.confirmPassword) {
				toastStore.showToast(get(_)('password-not-match'));
			}
			await userRepository.updatePasswordAsync(request);
			toastStore.showToast(get(_)('password-updated'));
		}
	};
};

export const userStore = createUserStore();
