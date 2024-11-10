import type { ListOption } from '$lib/Models/Common/ListOption';
import type { UserEntity } from '$lib/Models/Entities/User';
import type { UpdatePasswordRequest } from '$lib/Models/Request/Password';
import { supabase } from '$lib/Supabase/supabase';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { IUser } from '../Interface/IUser';
import type { UpdateUser } from '$lib/Supabase/Types/database.types';

export class UserRepository implements IUser {
	async getUserByUidAsync(uid: string): Promise<UserEntity> {
		const response = await supabase
			.from('User')
			.select('*')
			.eq('auth', uid)
			.is('deleted_at', null)
			.returns<UserEntity>()
			.single();
		if (response.error) {
			throw response.error;
		}
		return response.data;
	}
	async getUsersAsync(_option?: ListOption): Promise<PostgrestSingleResponse<UserEntity[]>> {
		const response = await supabase
			.from('User')
			.select('*', {
				count: 'exact'
			})
			.is('deleted_at', null)
			.order('id', { ascending: false })
			.range(
				((_option?.page ?? 1) - 1) * (_option?.limit ?? 10),
				(_option?.page ?? 1) * (_option?.limit ?? 10)
			)
			.returns<UserEntity[]>();

		if (response.error) {
			throw response.error;
		}
		return response;
	}
	async getUserAsync(id: number): Promise<UserEntity> {
		const response = await supabase
			.from('User')
			.select('*')
			.eq('id', id)
			.is('deleted_at', null)
			.returns<UserEntity>()
			.single();

		if (response.error) {
			throw response.error;
		}
		return response.data;
	}
	async updateProfile(user: UpdateUser): Promise<PostgrestSingleResponse<UserEntity>> {
		const response = await supabase
			.from('User')
			.update(user)
			.eq('id', user.id!)
			.select('*')
			.returns<UserEntity>()
			.single();
		if (response.error) {
			throw response.error;
		}
		return response;
	}
	async updatePasswordAsync(request: UpdatePasswordRequest): Promise<void> {
		const response = await supabase.auth.updateUser({
			password: request.newPassword
		});
		if (response.error) {
			throw response.error;
		}
	}
}
