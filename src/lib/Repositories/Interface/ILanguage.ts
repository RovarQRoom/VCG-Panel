import type { InsertLanguage, Language, UpdateLanguage } from '$lib/Supabase/Types/database.types';

export interface ILanguage {
	createLanguageAsync(language: InsertLanguage): Promise<Language>;
	getLanguageAsync(id: number): Promise<Language>;
	updateLanguageAsync(language: UpdateLanguage): Promise<Language>;
	deleteLanguageAsync(id: number): Promise<void>;
}
