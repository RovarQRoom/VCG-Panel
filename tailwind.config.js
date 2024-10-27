/** @type {import('tailwindcss').Config} */
import flowbitePlugin from 'flowbite/plugin';
import formsPlugin from '@tailwindcss/forms';
import typographyPlugin from '@tailwindcss/typography';
import aspectRatioPlugin from '@tailwindcss/aspect-ratio';

export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte-icons/**/*.{html,js,svelte,ts}'
	],
	darkMode: 'selector',
	theme: {
		extend: {
			colors: {
				blue: "#356fe1",
				darkBlue: "#212b3e",
				gray: "#f6f7f7",
				// flowbite-svelte
				primary: {
					light: '#8A70D6',
					dark: '#212121',
					50: '#FFF5F2',
					100: '#FFF1EE',
					200: '#FFE4DE',
					300: '#FFD5CC',
					400: '#FFBCAD',
					500: '#FE795D',
					600: '#EF562F',
					700: '#EB4F27',
					800: '#CC4522',
					900: '#A5371B'
				},
				secondary: {
					light: '#F0EDFF',
					dark: '#212b3e'
				},
				main: {
					light: '#FFFFFF',
					dark: '#212121'
				},
				input: {
					light: '#f1f1f1',
					dark: '#191919'
				}
			}
		},
		plugins: [flowbitePlugin, formsPlugin, typographyPlugin, aspectRatioPlugin]
	}
};
