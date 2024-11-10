import type { SettingEntity } from './Setting';

export class OptionEntity {
	id: number = null!;
	field: string = null!;
	disabled: boolean = false;
	setting?: SettingEntity;
	created_at: string = null!;
	deleted_at: string | null = null;
}
