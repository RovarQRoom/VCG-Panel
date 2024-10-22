import type { ListOption } from '$lib/Models/Common/ListOption';
import type {
	Database,
	InsertRegister,
	Register,
	UpdateRegister
} from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { IRegister } from '../Interface/IRegister';
import { supabase } from '$lib/Supabase/supabase';

export class RegisterRepository implements IRegister {
	async createRegisterAsync(register: InsertRegister): Promise<Register> {
		const response = await supabase.from('Register').insert(register).select('*').single();
		if (response.error) {
			throw response.error;
		}
		return response.data;
	}
	async getRegisterAsync(id: number): Promise<Register> {
		const response = await supabase.from('Register').select('*').eq('id', id).single();
		if (response.error) {
			throw response;
		}
		return response.data;
	}
	async getRegistersAsync(_option?: ListOption): Promise<Register[]> {
		const response = await supabase.from('Register').select('*');
		if (response.error) {
			throw response.error;
		}
		return response.data;
	}
	async updateRegisterAsync(register: UpdateRegister): Promise<Register> {
		const response = await supabase
			.from('Register')
			.update(register)
			.eq('id', register.id!)
			.select('*')
			.single();
		if (response.error) {
			throw response.error;
		}
		return response.data;
	}
	async deleteRegisterAsync(id: number): Promise<void> {
		await supabase.from('Register').update({ deleted_at: new Date().toUTCString() }).eq('id', id);
	}
}
