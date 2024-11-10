import { get, writable } from 'svelte/store';
import type { User } from '@supabase/supabase-js';
import { AuthenticationRepository } from '$lib/Repositories/Implementation/Authentication';
import { toastStore } from './Toast';
import { _ } from 'svelte-i18n';
import { UserRepository } from '$lib/Repositories/Implementation/User';
import type { UserEntity } from '$lib/Models/Entities/User';

const authRepo = new AuthenticationRepository();
const userRepo = new UserRepository();

function createAuthStore() {
	const { subscribe, set } = writable<UserEntity | null>(null);

	return {
		subscribe,

		signIn: async (email: string, password: string) => {
			const { data, error } = await authRepo.signInAsync(email, password);
			if (error) {
				toastStore.showToast(error.message);
				throw error;
			}
			const user = await userRepo.getUserByUidAsync(data.user?.id ?? '');
			set(user);
			return data;
		},

		signOut: async () => {
			await authRepo.signOutAsync();
			toastStore.showToast(get(_)('sign-out-successful'), 'success');
			set(null);
		},

		refreshUser: async () => {
			const user = await authRepo.getCurrentUserAsync();
			if (user) {
				const userEntity = await userRepo.getUserByUidAsync(user.id);
				set(userEntity);
			}
		},

		init: async () => {
			const session = await authRepo.getCurrentSessionAsync();

			if (session) {
				const userEntity = await userRepo.getUserByUidAsync(session.user.id);
				set(userEntity);
			} else {
				set(null);
			}
		}
	};
}

export const authStore = createAuthStore();
