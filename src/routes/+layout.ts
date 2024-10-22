import { browser } from '$app/environment';
import '$lib/i18n';
import { locale, waitLocale } from 'svelte-i18n';
import type { LayoutLoad, PageData } from './$types';

export const load: LayoutLoad = async () => {
	if (browser) {
		locale.set(window.navigator.language);
	}
	await waitLocale();

	return {
		session: null,
		user: null
	} as PageData;
};
