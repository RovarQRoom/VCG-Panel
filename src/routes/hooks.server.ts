import type { Handle } from '@sveltejs/kit';
import { locale } from 'svelte-i18n';

export const handle: Handle = async ({ event, resolve }) => {
	const lang = event.request.headers.get('accept-language')?.split(',')[0];
	localStorage.setItem('lang', lang || 'en');
	if (lang) {
		locale.set(localStorage.getItem('lang') || 'en');
	}
	return resolve(event);
};
