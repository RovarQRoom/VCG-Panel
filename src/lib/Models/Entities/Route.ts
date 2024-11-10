import type { Language } from '$lib/Supabase/Types/database.types';

export class RouteEntity {
	id: number = null!;
	name: Language = null!;
	link: string = null!;
	disabled: boolean = false;
	icon: string | null = null;
	created_at: string = null!;
	deleted_at: string | null = null;
}
