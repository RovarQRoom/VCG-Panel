import type { ListOption } from '$lib/Models/Common/ListOption';
import type { InsertSocial, Social, UpdateSocial } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

export interface ISocial {
	createSocialAsync(social: InsertSocial): Promise<Social>;
	createSocialsAsync(socials: InsertSocial[]): Promise<Social[]>;
	getSocialAsync(id: number): Promise<Social>;
	getSocialsAsync(option?: ListOption): Promise<PostgrestSingleResponse<Social[]>>;
	updateSocialAsync(social: UpdateSocial): Promise<Social>;
	deleteSocialAsync(id: number): Promise<void>;
}
