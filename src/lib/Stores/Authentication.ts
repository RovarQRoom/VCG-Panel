import { writable } from 'svelte/store';

import type { User } from '@supabase/supabase-js';

import { AuthenticationRepository } from '$lib/Repositories/Implementation/Authentication';

function createAuthStore() {
	const { subscribe, set } = writable<User | null>(null);

	const authRepo = new AuthenticationRepository();

	return {
		subscribe,

		signIn: async (email: string, password: string) => {
			const { data, error } = await authRepo.signInAsync(email, password);

			if (error) throw error;

			set(data.user);

			return data;
		},

		signOut: async () => {
			await authRepo.signOutAsync();

			set(null);
		},

		refreshUser: async () => {
			const user = await authRepo.getCurrentUserAsync();

			set(user);
		},

		init: async () => {
			const session = await authRepo.getCurrentSessionAsync();

			if (session) {
				set(session.user);
			} else {
				set(null);
			}
		}
	};
}

export const authStore = createAuthStore();
