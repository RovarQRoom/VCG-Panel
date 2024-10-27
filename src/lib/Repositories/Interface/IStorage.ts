export interface IStorage {
	uploadFileAsync(
		image: File,
		folderName?: string,
		storageName?: string
	): Promise<{
		id: string;
		path: string;
		fullPath: string;
	}>;
	deleteFileAsync(id: string): Promise<void>;
	deleteFileByPathAsync(path: string): Promise<void>;
}
