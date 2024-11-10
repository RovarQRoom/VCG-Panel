<script lang="ts">
	import { Sidebar, SidebarGroup, SidebarItem } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import { _ } from 'svelte-i18n';
	$: activeUrl = $page.url.pathname;
	let activeClass = 'text-sky-600 dark:text-sky-400 font-bold';
</script>

<div class="flex pt-[64px]">
	<aside class="fixed left-0 w-64 h-[calc(100vh-64px)] bg-white dark:bg-main-dark shadow-lg">
		<Sidebar class="h-full space-y-4 py-6">
			<SidebarGroup>
				<SidebarItem
					label={$_('profile-settings')}
					href="/setting/profile"
					class="sidebar-item {activeUrl.startsWith('/setting/profile') ? activeClass : ''}"
				>
					<svelte:fragment slot="icon">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-5 h-5"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
							/>
						</svg>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem
					label={$_('password-settings')}
					href="/setting/password"
					class="sidebar-item {activeUrl.startsWith('/setting/password') ? activeClass : ''}"
				>
					<svelte:fragment slot="icon">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-5 h-5"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
							/>
						</svg>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem
					label={$_('route-settings')}
					href="/setting/route"
					class="sidebar-item {activeUrl.startsWith('/setting/route') ? activeClass : ''}"
				>
					<svelte:fragment slot="icon">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-5 h-5"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
							/>
						</svg>
					</svelte:fragment>
				</SidebarItem>
			</SidebarGroup>
		</Sidebar>
	</aside>
	<main class="flex-1 bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-64px)]">
		<div class="max-w-7xl mx-auto">
			<slot />
		</div>
	</main>
</div>

<style>
	:global(.sidebar-item) {
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		margin-bottom: 0.25rem;
		transition: all 0.3s ease;
		position: relative;
		overflow: hidden;
	}

	:global(.sidebar-item::before) {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: currentColor;
		opacity: 0;
		transition: opacity 0.3s ease;
		z-index: 0;
	}

	:global(.sidebar-item[data-active='true']) {
		background-color: rgb(219 234 254);
		color: rgb(37 99 235);
		font-weight: 500;
	}

	:global(.dark .sidebar-item[data-active='true']) {
		background-color: rgba(37, 99, 235, 0.2);
		color: rgb(96 165 250);
	}

	:global(.sidebar-item:hover:not([data-active='true'])) {
		background-color: rgb(243 244 246);
		transform: translateX(4px);
	}

	:global(.dark .sidebar-item:hover:not([data-active='true'])) {
		background-color: rgb(31 41 55);
	}
</style>
