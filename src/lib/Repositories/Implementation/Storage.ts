import moment from 'moment';
import type { IStorageRepository } from '../Interface/IStorage';
import { supabase } from '$lib/Supabase/supabase';

export class StorageRepository implements IStorageRepository {
	async uploadFileAsync(
		image: File,
		folderName?: string,
		storageName?: string
	): Promise<{
		id: string;
		path: string;
		fullPath: string;
	}> {
		const response = await supabase.storage
			.from(storageName ?? 'files')
			.upload(
				`${folderName ?? 'public/'}${moment().format('YY-MM-DD:HH:mm:ss')}${image.name}`,
				image
			);
		if (response.error) {
			throw new Error(response.error.message);
		}
		return response.data;
	}
	async deleteFileAsync(id: string): Promise<void> {
		await supabase.storage.from('files').remove([id]);
	}
	async deleteFileByPathAsync(path: string): Promise<void> {
		await supabase.storage.from('files').remove([path]);
	}

	async getFileInfoAsync(path: string) {
		const response = await supabase.storage.from('files').info(path);
		if (response.error) {
			throw new Error(response.error.message);
		}
		return response.data;
	}
}
