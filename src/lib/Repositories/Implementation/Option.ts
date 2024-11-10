import type { ListOption } from '$lib/Models/Common/ListOption';
import type { OptionEntity } from '$lib/Models/Entities/Option';
import type { InsertOption, UpdateOption } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { IOption } from '../Interface/IOption';
import { supabase } from '$lib/Supabase/supabase';

export class OptionRepository implements IOption {
	async createOptionAsync(option: InsertOption): Promise<OptionEntity> {
		const response = await supabase
			.from('Option')
			.insert(option)
			.select('*')
			.returns<OptionEntity>()
			.single();

		if (response.error) {
			throw response.error;
		}
		return response.data;
	}

	async getOptionAsync(id: number): Promise<OptionEntity> {
		const response = await supabase
			.from('Option')
			.select('*')
			.eq('id', id)
			.is('deleted_at', null)
			.returns<OptionEntity>()
			.single();

		if (response.error) {
			throw response.error;
		}
		return response.data;
	}
	async getOptionsBySettingIdAsync(setting_id: number): Promise<OptionEntity[]> {
		const response = await supabase
			.from('Option')
			.select('*')
			.eq('setting', setting_id)
			.is('deleted_at', null)
			.returns<OptionEntity[]>();

		if (response.error) {
			throw response.error;
		}
		return response.data;
	}

	async getOptionsAsync(_option?: ListOption): Promise<PostgrestSingleResponse<OptionEntity[]>> {
		const response = await supabase
			.from('Option')
			.select('*', {
				count: 'exact'
			})
			.is('deleted_at', null)
			.order('id', { ascending: false })
			.range(
				((_option?.page ?? 1) - 1) * (_option?.limit ?? 10),
				(_option?.page ?? 1) * (_option?.limit ?? 10)
			)
			.returns<OptionEntity[]>();

		if (response.error) {
			throw response.error;
		}
		return response;
	}

	async updateOptionAsync(option: UpdateOption): Promise<OptionEntity> {
		const response = await supabase
			.from('Option')
			.update(option)
			.eq('id', option.id!)
			.select('*')
			.returns<OptionEntity>()
			.single();

		if (response.error) {
			throw response.error;
		}
		return response.data;
	}

	async deleteOptionAsync(id: number): Promise<void> {
		await supabase.from('Option').update({ deleted_at: new Date().toUTCString() }).eq('id', id);
	}
}
