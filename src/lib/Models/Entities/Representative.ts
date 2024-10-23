import type { Language } from '$lib/Supabase/Types/database.types';

export class RepresentativeEntity {
	id: number = null!;
	name?: Language | null = null;
	description?: Language | null = null;
	image: string | null = null;
	created_at: string = null!;
	deleted_at: string | null = null;
}
