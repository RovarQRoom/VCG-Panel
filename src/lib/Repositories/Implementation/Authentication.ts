import { supabase } from '$lib/Supabase/supabase';

import type { IAuthentication } from '../Interface/IAuthentication';

import type { AuthResponse, Session, User } from '@supabase/supabase-js';

export class AuthenticationRepository implements IAuthentication {
	async signInAsync(email: string, password: string): Promise<AuthResponse> {
		const response = await supabase.auth.signInWithPassword({ email, password });

		if (response.error) {
			throw response.error;
		}

		return response;
	}

	async signOutAsync(): Promise<void> {
		const { error } = await supabase.auth.signOut();

		if (error) {
			throw error;
		}
	}

	async getCurrentUserAsync(): Promise<User | null> {
		const {
			data: { user },
			error
		} = await supabase.auth.getUser();

		if (error) {
			throw error;
		}

		return user;
	}

	async getCurrentSessionAsync(): Promise<Session | null> {
		const { data, error } = await supabase.auth.getSession();

		if (error) {
			throw error;
		}

		return data.session;
	}
}
