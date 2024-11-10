import type { Language } from '$lib/Supabase/Types/database.types';
import type { SettingEntity } from './Setting';

export class RouteEntity {
	id: number = null!;
	name: Language | null = null;
	link: string = null!;
	disabled: boolean = false;
	icon: string | null = null;
	setting?: SettingEntity;
	created_at: string = null!;
	deleted_at: string | null = null;
}
