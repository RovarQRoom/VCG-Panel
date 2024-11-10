import type { ListOption } from '$lib/Models/Common/ListOption';
import type { SettingEntity } from '$lib/Models/Entities/Setting';
import type { InsertSetting, UpdateSetting } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { ISetting } from '../Interface/ISetting';
import { supabase } from '$lib/Supabase/supabase';

export class SettingRepository implements ISetting {
	async createSettingAsync(setting: InsertSetting): Promise<SettingEntity> {
		const response = await supabase
			.from('Setting')
			.insert(setting)
			.select('*, options(*)')
			.returns<SettingEntity>()
			.single();

		if (response.error) {
			throw response.error;
		}
		return response.data;
	}

	async getSettingAsync(id: number): Promise<SettingEntity> {
		const response = await supabase
			.from('Setting')
			.select('*, options(*)')
			.eq('id', id)
			.is('deleted_at', null)
			.returns<SettingEntity>()
			.single();

		if (response.error) {
			throw response.error;
		}
		return response.data;
	}

	async getSettingsAsync(_option?: ListOption): Promise<PostgrestSingleResponse<SettingEntity[]>> {
		const response = await supabase
			.from('Setting')
			.select('*, options(*)', {
				count: 'exact'
			})
			.is('deleted_at', null)
			.order('id', { ascending: false })
			.range(
				((_option?.page ?? 1) - 1) * (_option?.limit ?? 10),
				(_option?.page ?? 1) * (_option?.limit ?? 10)
			)
			.returns<SettingEntity[]>();

		if (response.error) {
			throw response.error;
		}
		return response;
	}

	async updateSettingAsync(setting: UpdateSetting): Promise<SettingEntity> {
		const response = await supabase
			.from('Setting')
			.update(setting)
			.eq('id', setting.id!)
			.select('*, options(*)')
			.returns<SettingEntity>()
			.single();

		if (response.error) {
			throw response.error;
		}
		return response.data;
	}

	async deleteSettingAsync(id: number): Promise<void> {
		await supabase.from('Setting').update({ deleted_at: new Date().toUTCString() }).eq('id', id);
	}
}
