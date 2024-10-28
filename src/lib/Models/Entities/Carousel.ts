import type { Language } from '$lib/Supabase/Types/database.types';

export class CarouselEntity {
	id: number = null!;
	title?: Language | null;
	description?: Language | null;
	media: Language | null = null;
	thumbnail_video: string | null = null;
	created_at: string = null!;
	deleted_at: string | null = null;
}
