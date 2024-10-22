import { supabase } from '$lib/Supabase/supabase';
import type { Card, InsertCard, UpdateCard } from '$lib/Supabase/Types/database.types';
import type { ICard } from '../Interface/ICard';
import type { ListOption } from '$lib/Models/Common/ListOption';
import type { CardEntity } from '$lib/Models/Entities/Card';

export class CardRepository implements ICard {
	async createCardAsync(card: InsertCard): Promise<CardEntity> {
		const response = await supabase
			.from('Card')
			.insert(card)
			.select('*')
			.returns<CardEntity>()
			.single();
		if (response.error) {
			throw response.error;
		}
		return response.data;
	}
	async getCardAsync(id: number): Promise<CardEntity> {
		const response = await supabase
			.from('Card')
			.select('*,title(id,en,ar,ckb),description(id,en,ar,ckb)')
			.eq('id', id)
			.returns<CardEntity>()
			.single();
		if (response.error) {
			throw response.error;
		}
		return response.data;
	}
	async getCardsAsync(_option?: ListOption): Promise<CardEntity[]> {
		const response = await supabase
			.from('Card')
			.select('*,title(en),description(en)')
			.is('deleted_at', null)
			.returns<CardEntity[]>();
		if (response.error) {
			throw response.error;
		}
		return response.data;
	}
	async updateCardAsync(card: UpdateCard): Promise<CardEntity> {
		const response = await supabase
			.from('Card')
			.update(card)
			.eq('id', card.id!)
			.select('*')
			.returns<CardEntity>()
			.single();
		if (response.error) {
			throw response.error;
		}
		return response.data;
	}
	async deleteCardAsync(id: number): Promise<void> {
		await supabase.from('Card').update({ deleted_at: new Date().toUTCString() }).eq('id', id);
	}
}
