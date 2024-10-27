import type { ListOption } from '$lib/Models/Common/ListOption';
import type { FooterEntity } from '$lib/Models/Entities/Footer';
import type { Footer, InsertFooter, UpdateFooter } from '$lib/Supabase/Types/database.types';

export interface IFooter {
	createFooterAsync(footer: InsertFooter): Promise<Footer>;
	getFooterAsync(id: number): Promise<Footer>;
	getFootersAsync(option?: ListOption): Promise<Footer[]>;
	getLatestFooterAsync(): Promise<FooterEntity>;
	updateFooterAsync(footer: UpdateFooter): Promise<Footer>;
	deleteFooterAsync(id: number): Promise<void>;
}
