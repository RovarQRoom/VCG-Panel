import type { Database } from '$lib/Supabase/Types/database.types';
import { PageOption } from './PageOption';

export class ListOption extends PageOption {
	language?: string = 'ckb';
	selected?: string;
	equal?: string;
	notEqual?: string;
	in?: string[];
	notIn?: string[];
	from?: string;
	to?: string;
	field?: string;
}
