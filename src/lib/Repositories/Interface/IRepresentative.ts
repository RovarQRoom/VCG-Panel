import type { ListOption } from '$lib/Models/Common/ListOption';
import type { RepresentativeEntity } from '$lib/Models/Entities/Representative';
import type {
	InsertRepresentative,
	UpdateRepresentative
} from '$lib/Supabase/Types/database.types';

export interface IRepresentative {
	createRepresentativeAsync(representative: InsertRepresentative): Promise<RepresentativeEntity>;
	getRepresentativeAsync(id: number): Promise<RepresentativeEntity>;
	getRepresentativesAsync(option?: ListOption): Promise<RepresentativeEntity[]>;
	updateRepresentativeAsync(representative: UpdateRepresentative): Promise<RepresentativeEntity>;
	deleteRepresentativeAsync(id: number): Promise<void>;
	// Add the new function
	getLatestRepresentativeAsync(): Promise<RepresentativeEntity | null>;
}
