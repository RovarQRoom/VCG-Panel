import type { ListOption } from '$lib/Models/Common/ListOption';
import type { InsertSocial, Social, UpdateSocial } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { ISocial } from '../Interface/ISocial';
import { supabase } from '$lib/Supabase/supabase';

export class SocialRepository implements ISocial {
	async createSocialAsync(social: InsertSocial): Promise<Social> {
		const response = await supabase
			.from('Social')
			.insert(social)
			.select('*')
			.returns<Social>()
			.single();
		if (response.error) {
			throw response.error;
		}
		return response.data;
	}
	async createSocialsAsync(socials: InsertSocial[]): Promise<Social[]> {
		const response = await supabase.from('Social').insert(socials).select('*').returns<Social[]>();
		if (response.error) {
			throw response.error;
		}
		return response.data;
	}
	async getSocialAsync(id: number): Promise<Social> {
		const response = await supabase
			.from('Social')
			.select('*')
			.eq('id', id)
			.returns<Social>()
			.single();
		if (response.error) {
			throw response.error;
		}
		return response.data;
	}
	async getSocialsAsync(option?: ListOption): Promise<PostgrestSingleResponse<Social[]>> {
		const response = await supabase
			.from('Social')
			.select('*')
			.range(
				((option?.page ?? 1) - 1) * (option?.limit ?? 10),
				(option?.page ?? 1) * (option?.limit ?? 10)
			)
			.returns<Social[]>();
		if (response.error) {
			throw response.error;
		}
		return response;
	}
	async updateSocialAsync(social: UpdateSocial): Promise<Social> {
		const response = await supabase
			.from('Social')
			.update(social)
			.eq('id', social.id!)
			.select('*')
			.returns<Social>()
			.single();
		if (response.error) {
			throw response.error;
		}
		return response.data;
	}
	async deleteSocialAsync(id: number): Promise<void> {
		await supabase.from('Social').update({ deleted_at: new Date().toUTCString() }).eq('id', id);
	}
}
