<script lang="ts">
	import '../app.css';

	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button, Spinner } from 'flowbite-svelte';

	import { onMount } from 'svelte';

	import { goto } from '$app/navigation';

	import { page } from '$app/stores';

	import { authStore } from '$lib/Stores/Authentication';

	import { fade, slide } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';

	import Toast from '$lib/Components/Toast.svelte';
	import { toastStore } from '$lib/Stores/Toast';

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

	// You can now use handleError in your authentication or other error-prone operations
</script>

{#if isLoading}
	<div class="flex items-center justify-center min-h-screen">
		<Spinner size="12" />
	</div>
{:else if !isSigninPage}
	<div class="flex flex-col min-h-screen">
		<Navbar
			class="bg-secondary-light dark:bg-secondary-dark text-primary-dark dark:text-primary-light p-2 rounded-full max-w-fit mx-auto mt-4 transition-all duration-300 ease-in-out"
		>
			<NavUl class="flex items-center space-x-4">
				{#each [{ href: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', name: 'Home', field: '/' },
				 { href: '/cards/1', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', name: 'Cards', field: '/cards' },
				  { href: '/carousels/1', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16', name: 'Carousels', field: '/carousels' },
				   { href: '/event', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', name: 'Event', field: '/event' },
				    { href: '/representative', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', name: 'Representative', field: '/representative' },
					 { href: '/registrations/1', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', name: 'Registrations', field: '/registrations' },
					 { href: '/footer', icon: 'M3 3h18v18H3V3zm4 2v14h2V5H7zm4 0v14h2V5h-2zm4 0v14h2V5h-2z', name: 'Footer', field: '/footer' }
					 ] as item}
					<NavLi
						href={item.href}
						class="relative flex items-center transition-all duration-300 ease-in-out {isActive(
							item.field
						)
							? 'text-blue-600 dark:text-blue-400'
							: 'hover:text-blue-400 dark:hover:text-blue-300'}"
					>
						<svg
							class="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon}
							></path>
						</svg>
						{#if isActive(item.field)}
							<span
								class="ml-2"
								in:slide={{ duration: 300, easing: cubicInOut }}
								out:fade={{ duration: 200 }}>{item.name}</span
							>
							<div
								class="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400"
								in:slide={{ duration: 300, easing: cubicInOut }}
							></div>
						{/if}
					</NavLi>
				{/each}
				<NavLi>
					<button
						on:click={handleSignOut}
						class="text-gray-700 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors duration-300"
					>
						<svg
							class="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
							></path>
						</svg>
					</button>
				</NavLi>
			</NavUl>
		</Navbar>

		<main
			class="container mx-auto mt-4 px-4 flex-grow bg-main-light dark:bg-main-dark text-main-dark dark:text-main-light"
		>
			<slot />
		</main>

		<footer class="bg-gray-100 py-4 mt-auto">
			<div class="container mx-auto px-4">
				<p class="text-center text-gray-600">
					© {new Date().getFullYear()} Your App Name. All rights reserved.
				</p>
			</div>
		</footer>
	</div>
{:else}
	<slot />
{/if}

<Toast />
