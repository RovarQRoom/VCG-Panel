<script lang="ts">
	import '../app.css';

	import { Navbar, NavLi, NavUl, Button, Spinner } from 'flowbite-svelte';

	import { onMount } from 'svelte';

	import { goto } from '$app/navigation';

	import { page } from '$app/stores';

	import { authStore } from '$lib/Stores/Authentication';

	import { fade, slide } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import NavBar from '$lib/Components/Navbar.Component.svelte';
	import Toast from '$lib/Components/Toast.svelte';
	import { DarkMode } from 'flowbite-svelte';
	import { _, locale } from 'svelte-i18n';
	import { Dropdown, DropdownItem } from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import { browser } from '$app/environment';

	let isLoading = true;

	onMount(() => {
		authStore.init().then(() => {
			isLoading = false;

			const unsubscribe = authStore.subscribe((user) => {
				if (!user && !$page.url.pathname.startsWith('/signin')) {
					goto('/signin');
				}
			});

			return () => unsubscribe();
		});
	});

	async function handleSignOut() {
		await authStore.signOut();

		goto('/signin');
	}

	$: isSigninPage = $page.url.pathname === '/signin';

	// Function to determine if a route is active
	$: isActive = (href: string): boolean => {
		if (href === '/') {
			return $page.url.pathname === '/';
		}
		return $page.url.pathname.startsWith(href) && href !== '/';
	};

	$: {
		if (browser) {
			if ($locale !== localStorage.getItem('lang')) {
				locale.set(localStorage.getItem('lang') || 'ckb');
			}
		}
	}

	// You can now use handleError in your authentication or other error-prone operations

	$: navItems = [
		{
			href: '/',
			icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
			name: 'Home',
			field: '/'
		},
		{
			href: '/cards/1',
			icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
			name: 'Cards',
			field: '/cards'
		},
		{
			href: '/carousels/1',
			icon: 'M4 6h16M4 10h16M4 14h16M4 18h16',
			name: 'Carousels',
			field: '/carousels'
		},
		{
			href: '/event',
			icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
			name: 'Event',
			field: '/event'
		},
		{
			href: '/representative',
			icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
			name: 'Representative',
			field: '/representative'
		},
		{
			href: '/registrations/1',
			icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
			name: 'Registrations',
			field: '/registrations'
		},
		{
			href: '/footer',
			icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
			name: 'Footer',
			field: '/footer'
		}
	];
</script>

{#if isLoading}
	<div class="flex items-center justify-center min-h-screen dark:text-white text-black">
		<Spinner size="12" />
	</div>
{:else if !isSigninPage}
	<div
		class="flex flex-col min-h-screen dark:text-white text-black"
		dir={$locale === 'en' ? 'ltr' : 'rtl'}
	>
	


		<NavBar />
		<main class="container mx-auto mt-4 px-4 flex-grow text-main-dark dark:text-main-light">
			<slot />
		</main>

		<footer class="bg-gray-100 py-4 mt-auto">
			<div class="container mx-auto px-4">
				<p class="text-center text-gray-600">
					© {new Date().getFullYear()} AhmedFX. All rights reserved
				</p>
			</div>
		</footer>
	</div>
{:else}
	<slot />
{/if}

<Toast />
