import type { Handle } from '@sveltejs/kit';
import { locale } from 'svelte-i18n';

export const handle: Handle = async ({ event, resolve }) => {
	const lang = event.request.headers.get('accept-language')?.split(',')[0];
	const savedLang = localStorage.getItem('lang');
	if (lang && lang !== savedLang) {
		locale.set(lang);
		localStorage.setItem('lang', lang);
	} else {
		locale.set(savedLang || 'ckb');
	}
	return resolve(event);
};
