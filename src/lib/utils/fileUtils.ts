export function isVideoFile(filename: string | undefined): boolean {
	if (!filename) return false;
	const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
	return videoExtensions.some((ext) => filename.toLowerCase().endsWith(ext));
}

export function isVideoLink(link: string): boolean {
	const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
	return videoExtensions.some((ext) => link.toLowerCase().endsWith(ext));
}
