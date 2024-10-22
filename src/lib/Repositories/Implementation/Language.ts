import type { Database, InsertLanguage, Language } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { ILanguage } from '../Interface/ILanguage';
import { supabase } from '$lib/Supabase/supabase';

export class LanguageRepository implements ILanguage {
	async createLanguageAsync(language: InsertLanguage): Promise<Language> {
		const response = await supabase.from('Language').insert(language).select('*').single();
		if (response.error) {
			throw response.error;
		}
		return response.data;
	}
	async getLanguageAsync(id: number): Promise<Language> {
		const response = await supabase.from('Language').select('*').eq('id', id).single();
		if (response.error) {
			throw response.error;
		}
		return response.data;
	}
	async updateLanguageAsync(
		language: Database['public']['Tables']['Language']['Update']
	): Promise<Language> {
		const response = await supabase
			.from('Language')
			.update(language)
			.eq('id', language.id!)
			.select('*')
			.single();
		if (response.error) {
			throw response.error;
		}
		return response.data;
	}
	async deleteLanguageAsync(id: number): Promise<void> {
		await supabase.from('Language').update({ deleted_at: new Date().toUTCString() }).eq('id', id);
	}
}
