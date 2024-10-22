import { StorageRepository } from '$lib/Repositories/Implementation/Storage';
import { _ } from 'svelte-i18n';
import { get, writable } from 'svelte/store';

const storageRepository = new StorageRepository();

const createStorageStore = () => {
	const { subscribe, set, update } = writable<string>('');

	return {
		subscribe,
		fetchFileInfo: async (path: string) => {
			const response = await storageRepository.getFileInfoAsync(path);
			return response;
		},
		uploadFile: async (image: File | null, folderName?: string, storageName?: string) => {
			if (!image) throw new Error(get(_)('no-image-selected'));
			const response = await storageRepository.uploadFileAsync(image);
			set(response.fullPath);
			return response;
		},
		uploadFiles: async (images: File[] | null, folderName?: string, storageName?: string) => {
			if (!images) throw new Error(get(_)('no-image-selected'));
			const response = Promise.all(
				images.map(async (image) => await storageRepository.uploadFileAsync(image))
			);
			return response;
		},
		uploadFileWithLanguage: async (image: File | null, lang: string) => {
			if (!image) throw new Error(get(_)('no-image-selected'));
			const response = await storageRepository.uploadFileAsync(image);
			return {
				[lang]: response
			};
		},
		deleteFile: async (id: string) => {
			await storageRepository.deleteFileAsync(id);
			set('');
		},
		deleteFileByPath: async (path: string) => {
			await storageRepository.deleteFileByPathAsync(path);
			set('');
		}
	};
};

export const storageStore = createStorageStore();
