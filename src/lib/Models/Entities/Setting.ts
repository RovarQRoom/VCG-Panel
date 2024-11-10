import type { OptionEntity } from './Option';
import type { RouteEntity } from './Route';

export class SettingEntity {
	id: number = null!;
	route?: RouteEntity;
	options?: OptionEntity[] = [];
	created_at: string = null!;
	deleted_at: string | null = null;
}
