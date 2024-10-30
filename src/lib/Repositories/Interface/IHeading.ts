import type { ListOption } from '$lib/Models/Common/ListOption';
import type { HeadingEntity } from '$lib/Models/Entities/Heading';
import type { HeadingEnum, InsertHeading, UpdateHeading } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

export interface IHeading {
	createHeadingAsync(heading: InsertHeading): Promise<HeadingEntity>;
	getHeadingAsync(id: number): Promise<HeadingEntity>;
	getHeadingsAsync(option?: ListOption): Promise<PostgrestSingleResponse<HeadingEntity[]>>;
	getHeadingByTypeAsync(type: HeadingEnum): Promise<HeadingEntity | null>;
	updateHeadingAsync(heading: UpdateHeading): Promise<HeadingEntity>;
	deleteHeadingAsync(id: number): Promise<void>;
}
