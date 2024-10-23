<script lang="ts">
	import { goto } from '$app/navigation';
	import type { ListOption } from '$lib/Models/Common/ListOption';
	import { Pagination, type LinkType } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	export let filter: ListOption = {
		page: 1
	};
	export let Store: any;
	export let currentPage: number;
	export let name: string;
	let pageCount: LinkType[] = [];

	let activeClass =
		'px-3 py-2 text-sm font-medium text-white bg-primary-light dark:bg-primary-dark rounded-lg';
	let normalClass =
		'px-3 py-2 text-sm font-medium text-primary-dark bg-secondary-light hover:bg-primary-light hover:text-white dark:bg-secondary-dark dark:text-primary-light dark:hover:bg-primary-dark dark:hover:text-white rounded-lg transition-colors duration-300';

	onMount(async () => {
		await fetchData();
	});

	async function fetchData() {
		try {
			await Store.fetchAll(filter);
			updatePageCount();
		} catch (e) {
			console.log(e);
		}
	}

	function updatePageCount() {
		const totalPages = $Store.pages!;
		const current = filter.page!;

		// Always show 5 pages if possible
		let startPage = Math.max(1, current - 2);
		let endPage = Math.min(totalPages, startPage + 4);

		// Adjust start page if we're near the end
		if (endPage - startPage < 4) {
			startPage = Math.max(1, endPage - 4);
		}

		pageCount = Array.from({ length: endPage - startPage + 1 }, (_, i) => ({
			name: (startPage + i).toString(),
			active: startPage + i === current
		}));

		// Add first and last page if they're not in the range
		if (startPage > 1) {
			pageCount.unshift({ name: '1', active: false });
			if (startPage > 2) pageCount.splice(1, 0, { name: '...', active: false });
		}
		if (endPage < totalPages) {
			if (endPage < totalPages - 1) pageCount.push({ name: '...', active: false });
			pageCount.push({ name: totalPages.toString(), active: false });
		}
	}

	const previous = async () => {
		if (currentPage === 1) {
			return;
		}
		currentPage -= 1;
		filter.page = currentPage;
		goto(`/${name}/${currentPage}`);
		debouncedFetchData();
	};

	const next = async () => {
		if (currentPage == $Store.pages!) {
			return;
		}
		currentPage += 1;
		filter.page = currentPage;
		goto(`/${name}/${currentPage}`);
		debouncedFetchData();
	};

	const setPage = async (event: MouseEvent) => {
		const target = event.target as HTMLElement; // Type assertion here
		const page = parseInt(target.innerText);
		if (page === currentPage) return;
		currentPage = page;
		filter.page = currentPage;
		goto(`/${name}/${page}`);
		debouncedFetchData();
	};

	function debounce(func: any, wait: number) {
		let timeout: any;
		return (...args: any[]) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => func(...args), wait);
		};
	}

	const debouncedFetchData = debounce(fetchData, 10);
	let previousPage = currentPage;
	$: {
		if (currentPage !== previousPage) {
			previousPage = currentPage;
			filter.page = currentPage;
			debouncedFetchData();
		}
	}
</script>

{#if $Store && ($Store.pages ?? 0) > 1}
	<Pagination
		ulClass="inline-flex items-center gap-2"
		{normalClass}
		{activeClass}
		pages={pageCount}
		large
		on:previous={previous}
		on:next={next}
		on:click={(event) => {
			setPage(event);
		}}
	>
		<svelte:fragment slot="prev">
			<span class="sr-only">Previous</span>
			<svg
				class="w-5 h-5"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fill-rule="evenodd"
					d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
					clip-rule="evenodd"
				></path>
			</svg>
		</svelte:fragment>
		<svelte:fragment slot="next">
			<span class="sr-only">Next</span>
			<svg
				class="w-5 h-5"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fill-rule="evenodd"
					d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
					clip-rule="evenodd"
				></path>
			</svg>
		</svelte:fragment>
	</Pagination>
{/if}
