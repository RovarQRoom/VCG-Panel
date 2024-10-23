import type { ListOption } from '$lib/Models/Common/ListOption';
import type { InsertRegister, Register, UpdateRegister } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

export interface IRegister {
	createRegisterAsync(register: InsertRegister): Promise<Register>;
	getRegisterAsync(id: number): Promise<Register>;
	getRegistersAsync(option?: ListOption): Promise<PostgrestSingleResponse<Register[]>>;
	updateRegisterAsync(register: UpdateRegister): Promise<Register>;
	deleteRegisterAsync(id: number): Promise<void>;
}
