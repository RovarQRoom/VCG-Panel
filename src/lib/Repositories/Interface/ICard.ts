import type { ListOption } from '$lib/Models/Common/ListOption';
import type { CardEntity } from '$lib/Models/Entities/Card';
import type { InsertCard, UpdateCard } from '$lib/Supabase/Types/database.types';

export interface ICard {
	createCardAsync(card: InsertCard): Promise<CardEntity>;
	getCardAsync(id: number): Promise<CardEntity>;
	getCardsAsync(_option?: ListOption): Promise<CardEntity[]>;
	updateCardAsync(card: UpdateCard): Promise<CardEntity>;
	deleteCardAsync(id: number): Promise<void>;
}
