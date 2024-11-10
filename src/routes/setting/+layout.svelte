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
						class="nav-item text-gray-700 dark:text-gray-200 {activeUrl.startsWith('/setting/password') ? activeClass : ''}"
					>
						{$_('password-settings')}
					</a>
					<a
						href="/setting/route"
						class="nav-item text-gray-700 dark:text-gray-200 {activeUrl.startsWith('/setting/route') ? activeClass : ''}"
					>
						{$_('route-settings')}
					</a>
				</div>
			</div>

			<!-- Mobile Navigation Menu -->
			<div class="md:hidden {isMenuOpen ? 'block' : 'hidden'} pb-3">
				<a
					href="/setting/password"
					class="nav-item block {activeUrl.startsWith('/setting/password') ? activeClass : ''}"
				>
					{$_('password-settings')}
				</a>
				<a
					href="/setting/route"
					class="nav-item block {activeUrl.startsWith('/setting/route') ? activeClass : ''}"
				>
					{$_('route-settings')}
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
		display: inline-block;
	}

	.nav-item:hover:not([data-active='true']) {
		background-color: rgb(243 244 246);
		transform: translateX(4px);
	}

	:global(.dark) .nav-item:hover:not([data-active='true']) {
		background-color: rgb(31 41 55);
	}
</style>
