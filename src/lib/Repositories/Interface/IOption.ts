import type { ListOption } from '$lib/Models/Common/ListOption';
import type { OptionEntity } from '$lib/Models/Entities/Option';
import type { InsertOption, UpdateOption } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

export interface IOption {
    createOptionAsync(option: InsertOption): Promise<OptionEntity>;
    getOptionAsync(id: number): Promise<OptionEntity>;
    getOptionsBySettingIdAsync(setting_id: number): Promise<OptionEntity[]>;
    getOptionsAsync(option?: ListOption): Promise<PostgrestSingleResponse<OptionEntity[]>>;
    updateOptionAsync(option: UpdateOption): Promise<OptionEntity>;
    deleteOptionAsync(id: number): Promise<void>;
} 