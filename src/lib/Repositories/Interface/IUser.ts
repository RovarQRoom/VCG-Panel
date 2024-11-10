import type { ListOption } from '$lib/Models/Common/ListOption';
import type { UserEntity } from '$lib/Models/Entities/User';
import type { UpdatePasswordRequest } from '$lib/Models/Request/Password';
import type { UpdateUser } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

export interface IUser {
	getUsersAsync(options?: ListOption): Promise<PostgrestSingleResponse<UserEntity[]>>;
	getUserAsync(id: number): Promise<UserEntity>;
	getUserByUidAsync(uid: string): Promise<UserEntity>;
	updatePasswordAsync(request: UpdatePasswordRequest): Promise<void>;
	updateProfile(user: UpdateUser): Promise<PostgrestSingleResponse<UserEntity>>;
}
