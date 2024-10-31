import type { Social } from '$lib/Supabase/Types/database.types';

export class FooterEntity {
	id: number = null!;
	phones: string[] = [];
	socials: Social[] = [];
	created_at: string = null!;
	deleted_at: string | null = null;
}
