import type { ListOption } from '$lib/Models/Common/ListOption';
import type { SettingEntity } from '$lib/Models/Entities/Setting';
import type { InsertSetting, UpdateSetting } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

export interface ISetting {
    createSettingAsync(setting: InsertSetting): Promise<SettingEntity>;
    getSettingAsync(id: number): Promise<SettingEntity>;
    getSettingsAsync(option?: ListOption): Promise<PostgrestSingleResponse<SettingEntity[]>>;
    updateSettingAsync(setting: UpdateSetting): Promise<SettingEntity>;
    deleteSettingAsync(id: number): Promise<void>;
} 