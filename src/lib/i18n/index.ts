import { browser } from '$app/environment';
import { init, register } from 'svelte-i18n';

const defaultLocale = 'ckb';

register('en', () => import('./locales/en.json'));
register('ar', () => import('./locales/ar.json'));
register('ckb', () => import('./locales/ckb.json'));

init({
	fallbackLocale: defaultLocale,
	initialLocale: browser ? window.navigator.language : defaultLocale
});
