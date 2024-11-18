import type { ListOption } from '$lib/Models/Common/ListOption';
import type { InsertRegister, Register, UpdateRegister } from '$lib/Supabase/Types/database.types';
import type { IRegister } from '../Interface/IRegister';
import { supabase } from '$lib/Supabase/supabase';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

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
	async getRegistersAsync(_option?: ListOption): Promise<PostgrestSingleResponse<Register[]>> {
		const response = await supabase
			.from('Register')
			.select('*', {
				count: 'exact'
			})
			.is('deleted_at', null)
			.order('id', { ascending: false })
			.range(
				((_option?.page ?? 1) - 1) * (_option?.limit ?? 10),
				(_option?.page ?? 1) * (_option?.limit ?? 10) - 1
			);
		if (response.error) {
			throw response.error;
		}
		return response;
	}
	async getRegisterExportAsync(
		from: number,
		to: number,
		option?: ListOption
	): Promise<PostgrestSingleResponse<Register[]>> {
		const response = await supabase
			.from('Register')
			.select('*')
			.is('deleted_at', null)
			.order('id', { ascending: false })
			.range(from - 1, to);
		if (response.error) {
			throw response.error;
		}
		return response;
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
