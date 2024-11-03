<script lang="ts">
	import '../app.css';
	import { Spinner } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { authStore } from '$lib/Stores/Authentication';
	import Navbar from '$lib/Components/Navbar.Component.svelte';
	import Toast from '$lib/Components/Toast.svelte';
	import { _, locale } from 'svelte-i18n';

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

	$: isSigninPage = $page.url.pathname === '/signin';
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
		<Navbar />
		<main class="container mx-auto mt-4 px-4 flex-grow text-main-dark dark:text-main-light">
			<slot />
		</main>

		<footer class="bg-[#f1f1f1] dark:bg-darkBlue py-4 mt-auto">
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
