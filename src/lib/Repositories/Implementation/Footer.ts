import type { ListOption } from '$lib/Models/Common/ListOption';
import type {
	Database,
	Footer,
	InsertFooter,
	UpdateFooter
} from '$lib/Supabase/Types/database.types';
import type { IFooter } from '../Interface/IFooter';
import { supabase } from '$lib/Supabase/supabase';
import type { FooterEntity } from '$lib/Models/Entities/Footer';

export class FooterRepository implements IFooter {
	async createFooterAsync(footer: InsertFooter): Promise<Footer> {
		const response = await supabase.from('Footer').insert(footer).select('*').single();
		if (response.error) {
			throw response.error;
		}
		return response.data;
	}
	async getFooterAsync(id: number): Promise<Footer> {
		const response = await supabase.from('Footer').select('*').eq('id', id).single();
		if (response.error) {
			throw response.error;
		}
		return response.data;
	}
	async getFootersAsync(_option?: ListOption): Promise<Footer[]> {
		const response = await supabase.from('Footer').select('*');
		if (response.error) {
			throw response.error;
		}
		return response.data;
	}
	async getLatestFooterAsync(): Promise<FooterEntity> {
		// This is how to call one to Many relationship
		// also check deleted_at is null of socials
		const response = await supabase
			.from('Footer')
			.select('*, socials:Social(id,name,link,icon)', { count: 'exact' })
			.is('socials.deleted_at', null)
			.order('id', { ascending: false })
			.returns<FooterEntity>()
			.single();
		if (response.error) {
			throw response.error;
		}

		return response.data;
	}
	async updateFooterAsync(footer: UpdateFooter): Promise<Footer> {
		const response = await supabase
			.from('Footer')
			.update({
				phones: footer.phones
			})
			.eq('id', footer.id!)
			.select('*')
			.single();
		if (response.error) {
			throw response.error;
		}
		return response.data;
	}
	async deleteFooterAsync(id: number): Promise<void> {
		await supabase.from('Footer').update({ deleted_at: new Date().toUTCString() }).eq('id', id);
	}
}
