import { HeadingEnum, type Language } from '$lib/Supabase/Types/database.types';

export class HeadingEntity {
	id: number = 0;
	title?: Language | null = null;
	heading_type: HeadingEnum = HeadingEnum.CARD;
	created_at: string = '';
	deleted_at: string | null = null;
}
