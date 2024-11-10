<script lang="ts">
	import { page } from '$app/stores';
	import { _ } from 'svelte-i18n';
	$: activeUrl = $page.url.pathname;
	let activeClass = 'text-sky-600 dark:text-sky-400 font-bold';
	let isMenuOpen = false;
</script>

<div class="min-h-screen">
	<!-- Top Navigation -->
	<nav class="bg-white dark:bg-main-dark shadow-lg mt-24">
		<div class="max-w-7xl mx-auto px-4">
			<div class="flex justify-center h-16">
				<!-- Mobile menu button -->
				<button 
					class="md:hidden p-2"
					on:click={() => isMenuOpen = !isMenuOpen}
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				</button>

				<!-- Desktop Navigation -->
				<div class="hidden md:flex space-x-4 items-center">
					<a
						href="/setting/password"
						class="nav-item text-gray-700 dark:text-gray-200 flex items-center gap-2 {activeUrl.startsWith('/setting/password') ? activeClass : ''}"
					>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
					</svg>
						{$_('password-settings')}
					</a>
					<a
						href="/setting/route"
						class="nav-item text-gray-700 dark:text-gray-200 flex items-center gap-2 {activeUrl.startsWith('/setting/route') ? activeClass : ''}"
					>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
					</svg>
						{$_('route-settings')}
					</a>
					<a
						href="/setting/profile"
						class="nav-item text-gray-700 dark:text-gray-200 flex items-center gap-2 {activeUrl.startsWith('/setting/profile') ? activeClass : ''}"
					>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
					</svg>
						{$_('profile-settings')}
					</a>
				</div>
			</div>

			<!-- Mobile Navigation Menu -->
			<div class="md:hidden {isMenuOpen ? 'block' : 'hidden'} pb-3">
				<a
					href="/setting/password"
					class="nav-item flex items-center gap-2 {activeUrl.startsWith('/setting/password') ? activeClass : ''}"
				>
					{$_('password-settings')}
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
					</svg>
				</a>
				<a
					href="/setting/route"
					class="nav-item flex items-center gap-2 {activeUrl.startsWith('/setting/route') ? activeClass : ''}"
				>
					{$_('route-settings')}
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
					</svg>
				</a>
				<a
					href="/setting/profile"
					class="nav-item flex items-center gap-2 {activeUrl.startsWith('/setting/profile') ? activeClass : ''}"
				>
					{$_('profile-settings')}
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
					</svg>
				</a>
			</div>
		</div>
	</nav>

	<!-- Main content -->
	<main class="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 md:p-6">
		<div class="max-w-7xl mx-auto">
			<slot />
		</div>
	</main>
</div>

<style>
	.nav-item {
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		transition: all 0.3s ease;
	}

	.nav-item:hover:not([data-active='true']) {
		background-color: rgb(243 244 246);
		transform: translateX(4px);
	}

	:global(.dark) .nav-item:hover:not([data-active='true']) {
		background-color: rgb(31 41 55);
	}
</style>


