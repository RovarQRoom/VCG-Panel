import type { Language } from '$lib/Supabase/Types/database.types';

export class TicketEntity {
	id: number = null!;
	title: Language | null = null;
	icon: string | null = null;
	created_at: string = null!;
	deleted_at: string | null = null;
}
