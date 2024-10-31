import { StorageRepository } from '$lib/Repositories/Implementation/Storage';
import { _ } from 'svelte-i18n';
import { get, writable } from 'svelte/store';
import imageCompression from 'browser-image-compression';

const storageRepository = new StorageRepository();

// Compression options
const compressionOptions = {
	maxSizeMB: 1, // Maximum size in MB
	maxWidthOrHeight: 1920, // Max width/height
	useWebWorker: true, // Use web worker for better performance
	preserveExif: true, // Preserve image metadata
	fileType: 'auto' // Automatically determine file type
};

const compressImage = async (file: File): Promise<File> => {
	// Only compress if it's an image
	if (!file.type.startsWith('image/')) {
		return file;
	}

	try {
		return await imageCompression(file, compressionOptions);
	} catch (error) {
		console.warn('Image compression failed:', error);
		return file; // Return original file if compression fails
	}
};
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

			const compressedImage = await compressImage(image);
			const response = await storageRepository.uploadFileAsync(
				compressedImage,
				folderName,
				storageName
			);
			set(response.fullPath);
			return response;
		},
		uploadFiles: async (images: File[] | null, folderName?: string, storageName?: string) => {
			if (!images) throw new Error(get(_)('no-image-selected'));

			const compressedImages = await Promise.all(
				images.map(async (image) => await compressImage(image))
			);

			const response = Promise.all(
				compressedImages.map(
					async (image) => await storageRepository.uploadFileAsync(image, folderName, storageName)
				)
			);
			return response;
		},
		uploadFileWithLanguage: async (image: File | null, lang: string) => {
			if (!image) throw new Error(get(_)('no-image-selected'));

			const compressedImage = await compressImage(image);
			const response = await storageRepository.uploadFileAsync(compressedImage);
			return {
				[lang]: response
			};
		},
		removeFile: async (id: string) => {
			await storageRepository.deleteFileAsync(id);
			set('');
		},
		removeFileByPath: async (path: string) => {
			await storageRepository.deleteFileByPathAsync(path);
			set('');
		},
		removeFiles: async (paths: string[]) => {
			await storageRepository.deleteFilesAsync(paths);
		}
	};
};

export const storageStore = createStorageStore();
