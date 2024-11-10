<script lang="ts">
	import { Card, Label, Input, Button, Spinner } from 'flowbite-svelte';
	import { UpdatePasswordRequest } from '$lib/Models/Request/Password';
	import { _ } from 'svelte-i18n';
	import { userStore } from '$lib/Stores/User';
	import { toastStore } from '$lib/Stores/Toast';

	let passwordForm: UpdatePasswordRequest = new UpdatePasswordRequest();
	let isLoading = false;

	const handlePasswordUpdate = async () => {
		isLoading = true;
		try {
			await userStore.putPassword(passwordForm);
		} catch (error) {
			if (error instanceof Error) {
				toastStore.showToast(error.message, 'error');
			} else {
				toastStore.showToast($_('failed-to-update-password'), 'error');
			}
		} finally {
			isLoading = false;
			passwordForm = new UpdatePasswordRequest();
		}
	};
</script>

<div class="p-6">
	<h2 class="text-2xl font-bold mb-6 dark:text-white">{$_('setting-password')}</h2>
	<div class="max-w-2xl mx-auto bg-white dark:bg-main-dark rounded-lg shadow-lg p-6">
		<div class="space-y-4">
			<!-- <div>
				<Label for="oldPassword" class="mb-2">{$_('current-password')}</Label>
				<Input
					id="oldPassword"
					type="password"
					bind:value={passwordForm.oldPassword}
					placeholder={$_('enter-your-current-password')}
				/>
			</div> -->

			<div>
				<Label for="newPassword" class="mb-2">{$_('new-password')}</Label>
				<Input
					class="bg-input-light dark:bg-input-dark border-0"
					id="newPassword"
					type="password"
					bind:value={passwordForm.newPassword}
					placeholder={$_('enter-new-password')}
				/>
			</div>

			<div>
				<Label for="confirmPassword" class="mb-2">{$_('confirm-new-password')}</Label>
				<Input
				class="bg-input-light dark:bg-input-dark border-0"
					id="confirmPassword"
					type="password"
					bind:value={passwordForm.confirmPassword}
					placeholder={$_('confirm-new-password')}
				/>
			</div>

			<Button class="w-full bg-blue dark:bg-blue hover:bg-darkBlue dark:hover:bg-darkBlue duration-300 ease-in-out"  on:click={handlePasswordUpdate} disabled={isLoading}>
				{#if isLoading}
					<Spinner />
				{:else}
					{$_('update-password')}
				{/if}
			</Button>
		</div>
	</div>
</div>
