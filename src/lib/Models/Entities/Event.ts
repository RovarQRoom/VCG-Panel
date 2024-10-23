import type { Language } from '$lib/Supabase/Types/database.types';

export class EventEntity {
	id: number = null!;
	date: string = null!;
	place?: Language | null = null;
	ticket: string | null = null;
	created_at: string = null!;
	deleted_at: string | null = null;
}
