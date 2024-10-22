import type { Language } from '$lib/Supabase/Types/database.types';

export class CardEntity {
	id: number = null!;
	title?: Language;
	description?: Language;
	icon: string | null = null;
	created_at: string = null!;
	deleted_at: string | null = null;
}
