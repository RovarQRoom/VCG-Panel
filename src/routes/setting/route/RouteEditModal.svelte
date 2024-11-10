<script lang="ts">
	import { Modal, Label, Input, Tabs, TabItem, Img, Spinner } from 'flowbite-svelte';
	import { _ } from 'svelte-i18n';
	import type { Language, UpdateLanguage, UpdateRoute } from '$lib/Supabase/Types/database.types';
	import { routeStore } from '$lib/Stores/Route';
	import { ArrowUp } from 'svelte-heros-v2';
	import { toastStore } from '$lib/Stores/Toast';
	import type { RouteEntity } from '$lib/Models/Entities/Route';
	import { languageStore } from '$lib/Stores/Language';
	import { storageStore } from '$lib/Stores/Storage';

	export let showModal = false;
	export let route: number | null = null;
	let isLoading = false;
	let updateIsLoading = false;
	let updateRoute: UpdateRoute = {
		id: 0,
		name: 0
	};
	let nameLanguage: UpdateLanguage = {
		id: 0,
		ckb: ''
	};
	let iconFile: {
		file: File | null;
		preview: string | null;
	} = {
		file: null,
		preview: null
	};

	async function getRouteData() {
		isLoading = true;
		try {
			const routeData = await routeStore.fetch(route ?? 0);
			if (routeData) {
				updateRoute = {
					id: routeData.id,
					name: routeData.name.id,
					link: routeData.link,
					disabled: routeData.disabled,
					icon: routeData.icon
				};
				nameLanguage = {
					id: routeData.name.id,
					en: routeData.name.en,
					ckb: routeData.name.ckb
				};
				iconFile.preview = routeData.icon;
			}
		} catch (error) {
			console.error(error);
			toastStore.showToast($_('failed-to-load-route'), 'error');
		} finally {
			isLoading = false;
		}
	}

	const handleSubmit = async () => {
		updateIsLoading = true;
		showModal = false;
		let backupRoute = updateRoute;
		let backupNameLanguage = nameLanguage;
		let routeResponse: RouteEntity | null = null;
		let nameResponse: Language | null = null;
		try {
			nameResponse = await languageStore.put(nameLanguage);
			if (iconFile.file) {
				updateRoute.icon = (await storageStore.uploadFile(iconFile.file)).fullPath;
			}
			updateRoute.name = nameResponse.id;
			routeResponse = await routeStore.put(updateRoute);
		} catch (error) {
			if (nameResponse?.id) {
				await languageStore.put(backupNameLanguage);
			}
			if (routeResponse) {
				await routeStore.put(backupRoute);
			}
			if (error instanceof Error) {
				toastStore.showToast(error.message, 'error');
			} else {
				toastStore.showToast($_('failed-to-update-route'), 'error');
			}
		} finally {
			updateIsLoading = false;
		}
	};

	async function handleImageUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		if (!input.files?.length) return;

		const file = input.files[0];
		if (!file.type.startsWith('image/')) {
			toastStore.showToast($_('invalid-image-file'), 'error');
			return;
		}

		try {
			iconFile = {
				file,
				preview: URL.createObjectURL(file)
			};
		} catch (error) {
			toastStore.showToast($_('image-upload-failed'), 'error');
		}
	}

	let previousShowModal = showModal;
	$: if (showModal !== previousShowModal) {
		previousShowModal = showModal;
		getRouteData();
	}
</script>

<Modal
	bind:open={showModal}
	size="lg"
	autoclose={false}
	class="w-full"
	defaultClass="bg-[#f1f1f1] dark:bg-darkBlue"
	backdropClass="bg-white dark:bg-darkBlue backdrop-blur-sm"
>
	<div class="relative p-4">
		{#if isLoading}
			<div class="flex justify-center items-center min-h-[300px]">
				<div class="text-center">
					<Spinner size="12" class="mb-4" color="blue" />
					<p class="text-slate-600 dark:text-slate-400">{$_('loading')}...</p>
				</div>
			</div>
		{:else}
			<div class="text-center mb-6">
				<h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">
					{$_('edit-route')}
				</h2>
			</div>

			<form on:submit|preventDefault={handleSubmit}>
				<div class="mb-6">
					<Tabs style="underline">
						<TabItem open title="English">
							<div class="p-4">
								<Label for="name-en" class="mb-2 text-slate-700 dark:text-slate-300"
									>{$_('name')} (English)</Label
								>
								<Input
									id="name-en"
									bind:value={nameLanguage.en}
									required
									class="mt-1 dark:bg-[#1a2232] border-0 transition-all duration-300 hover:ring-2 hover:ring-sky-500 focus:ring-indigo-500"
									placeholder={$_('enter-english-name')}
								/>
							</div>
						</TabItem>
						<TabItem title="کوردی">
							<div class="p-4">
								<Label for="name-ckb" class="mb-2 text-slate-700 dark:text-slate-300"
									>{$_('name')} (کوردی)</Label
								>
								<Input
									id="name-ckb"
									bind:value={nameLanguage.ckb}
									required
									class="mt-1 dark:bg-[#1a2232] border-0 transition-all duration-300 hover:ring-2 hover:ring-sky-500 focus:ring-indigo-500"
									placeholder={$_('enter-kurdish-name')}
								/>
							</div>
						</TabItem>
					</Tabs>
				</div>

				<div class="mb-6 flex gap-4 items-end">
					<div class="flex-1">
						<Label for="link" class="mb-2 text-slate-700 dark:text-slate-300">{$_('link')}</Label>
						<Input
							id="link"
							bind:value={updateRoute.link}
							required
							class="mt-1 dark:bg-[#1a2232] border-0 transition-all duration-300 hover:ring-2 hover:ring-sky-500 focus:ring-indigo-500"
							placeholder={$_('enter-link')}
						/>
					</div>

					<div>
						<Label class="mb-2 text-slate-700 dark:text-slate-300">{$_('icon')}</Label>
						<div class="relative">
							{#if iconFile.preview}
								<div
									class="flex items-center justify-center size-10 overflow-hidden rounded-lg transition-transform duration-300 hover:scale-105"
								>
									<Img
										src={iconFile.preview}
										alt="Route icon"
										class="object-contain rounded-lg"
										style="width: 100px; height: 100px;"
									/>
								</div>
							{/if}
							<Input
								type="file"
								accept="image/*"
								class="absolute inset-0 opacity-0 cursor-pointer rounded-lg"
								on:change={handleImageUpload}
							/>
							{#if !iconFile.preview}
								<div
									class="flex items-center justify-center w-10 h-10 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg transition-all duration-300 hover:border-sky-500 dark:hover:border-sky-400"
								>
									<ArrowUp size="20" class="text-gray-400 dark:text-gray-500" />
								</div>
							{/if}
						</div>
					</div>
				</div>

				<div class="flex justify-end gap-3 mt-6">
					<button
						type="button"
						class="px-4 py-2 text-sm font-medium text-slate-500 hover:text-white bg-white dark:bg-[#1a2232] rounded-lg hover:bg-red-500 focus:ring-4 focus:ring-slate-200 transition-all duration-300 ease-in-out"
						on:click={() => (showModal = false)}
					>
						{$_('cancel')}
					</button>

					<button
						type="submit"
						class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-sky-600 to-indigo-700 rounded-lg shadow-md hover:from-sky-700 hover:to-indigo-800 focus:ring-4 focus:ring-sky-300 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
						disabled={updateIsLoading}
					>
						{#if updateIsLoading}
							<Spinner size="12" class="mr-2" />
						{/if}
						{$_('save')}
					</button>
				</div>
			</form>
		{/if}
	</div>
</Modal>
