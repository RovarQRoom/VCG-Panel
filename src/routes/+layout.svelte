<script lang="ts">
	import '../app.css';

	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button, Spinner } from 'flowbite-svelte';

	import { onMount } from 'svelte';

	import { goto } from '$app/navigation';

	import { page } from '$app/stores';

	import { authStore } from '$lib/Stores/Authentication';

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
</script>

{#if isLoading}
	<div class="flex items-center justify-center min-h-screen">
		<Spinner size="12" />
	</div>
{:else if !isSigninPage}
	<div class="flex flex-col min-h-screen">
		<Navbar let:hidden let:toggle>
			<NavBrand href="/">
				<img src="/images/logo.png" class="mr-3 h-6 sm:h-9" alt="Your Logo" />

				<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
					{$authStore?.email}
				</span>
			</NavBrand>

			<NavHamburger on:click={toggle} />

			<NavUl {hidden}>
				<NavLi href="/">Home</NavLi>

				<NavLi href="/cards">Cards</NavLi>

				<NavLi href="/carousels">Carousels</NavLi>

				<NavLi href="/event">Event</NavLi>

				<NavLi href="/representative">Representative</NavLi>

				<NavLi>
					<Button color="red" size="sm" on:click={handleSignOut}>Sign Out</Button>
				</NavLi>
			</NavUl>
		</Navbar>

		<main class="container mx-auto mt-4 px-4 flex-grow">
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
