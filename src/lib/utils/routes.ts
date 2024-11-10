import { _ } from "svelte-i18n";
import { get } from 'svelte/store';

export const routes = [
	{
		name: get(_)('home'),
		link: '/',
		class: 'active:text-blue'
	}
];
