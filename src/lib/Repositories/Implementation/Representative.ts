import type { ListOption } from '$lib/Models/Common/ListOption';
import type {
	InsertRepresentative,
	UpdateRepresentative
} from '$lib/Supabase/Types/database.types';
import type { IRepresentative } from '../Interface/IRepresentative';
import { supabase } from '$lib/Supabase/supabase';
import type { RepresentativeEntity } from '$lib/Models/Entities/Representative';

export class RepresentativeRepository implements IRepresentative {
	async createRepresentativeAsync(
		representative: InsertRepresentative
	): Promise<RepresentativeEntity> {
		const response = await supabase
			.from('Representative')
			.insert(representative)
			.select('*')
			.returns<RepresentativeEntity>()
			.single();
		if (response.error) {
			throw response.error;
		}
		return response.data;
	}
	async getRepresentativeAsync(id: number): Promise<RepresentativeEntity> {
		const response = await supabase
			.from('Representative')
			.select('*')
			.eq('id', id)
			.returns<RepresentativeEntity>()
			.single();
		if (response.error) {
			throw response.error;
		}
		return response.data;
	}
	async getRepresentativesAsync(option?: ListOption): Promise<RepresentativeEntity[]> {
		const response = await supabase
			.from('Representative')
			.select('*')
			.returns<RepresentativeEntity[]>();
		if (response.error) {
			throw response.error;
		}
		return response.data;
	}
	async updateRepresentativeAsync(
		representative: UpdateRepresentative
	): Promise<RepresentativeEntity> {
		const response = await supabase
			.from('Representative')
			.update(representative)
			.eq('id', representative.id!)
			.select('*')
			.returns<RepresentativeEntity>()
			.single();
		if (response.error) {
			throw response.error;
		}
		return response.data;
	}
	async deleteRepresentativeAsync(id: number): Promise<void> {
		await supabase
			.from('Representative')
			.update({ deleted_at: new Date().toUTCString() })
			.eq('id', id);
	}

	// Add the new method
	async getLatestRepresentativeAsync(): Promise<RepresentativeEntity | null> {
		const response = await supabase
			.from('Representative')
			.select('*, name(id,en,ar,ckb), description(id,en,ar,ckb)')
			.is('deleted_at', null)
			.order('created_at', { ascending: false })
			.limit(1)
			.returns<RepresentativeEntity>()
			.single();

		if (response.error) {
			if (response.error.code === 'PGRST116') {
				// No data found
				return null;
			}
			throw response.error;
		}

		return response.data;
	}
}
