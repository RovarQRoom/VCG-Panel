export function isVideoFile(filename: string | undefined ): boolean {
	if (!filename) return false;
	const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
	return videoExtensions.some((ext) => filename.toLowerCase().endsWith(ext));
}

export function isVideoLink(link: string): boolean {
	const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
	return videoExtensions.some((ext) => link.toLowerCase().endsWith(ext));
}

export function isVideoUrl(url: string): boolean {
	return (
		url.includes('youtube.com') ||
		url.includes('youtu.be') ||
		url.includes('vimeo.com') ||
		url.endsWith('.mp4')
	);
}

export function getEmbedUrl(url: string | null | undefined): string | null {
	if (!url) return null;
	const youtubeId = getYouTubeVideoId(url);
	if (youtubeId) {
		return `https://www.youtube.com/embed/${youtubeId}`;
	}

	const vimeoId = getVimeoVideoId(url);
	if (vimeoId) {
		return `https://player.vimeo.com/video/${vimeoId}`;
	}

	return null;
}

export function getYouTubeVideoId(url: string): string | null {
	const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
	const match = url.match(regExp);
	return match && match[2].length === 11 ? match[2] : null;
}

export function getVimeoVideoId(url: string): string | null {
	const regExp = /vimeo\.com\/(?:.*#|.*\/videos\/)?([0-9]+)/;
	const match = url.match(regExp);
	return match ? match[1] : null;
}
