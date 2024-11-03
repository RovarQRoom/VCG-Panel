<script lang="ts">
	import { Card, Button, Label, Input } from 'flowbite-svelte';

	import { authStore } from '$lib/Stores/Authentication';
	import { toastStore } from '$lib/Stores/Toast';

	import { goto } from '$app/navigation';
	import { _ } from 'svelte-i18n';

	let email: string = '';

	let password: string = '';

	let isLoading: boolean = false;

	async function handleSubmit() {
		isLoading = true;
		try {
			await authStore.signIn(email, password);
			toastStore.showToast($_('sign-in-successful'), 'success');
			goto('/');
		} catch (error) {
			if (error instanceof Error) {
				toastStore.showToast(error.message, 'error');
			} else {
				toastStore.showToast($_('unknown-error-occurred'), 'error');
			}
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="flex items-center justify-center min-h-screen bg-white">
	<Card class="w-full max-w-md bg-[#f1f1f1] dark:bg-darkBlue">
		<h2 class="text-2xl font-bold mb-6 text-center dark:text-white">{$_('sign-in')}</h2>

		<form on:submit|preventDefault={handleSubmit}>
			<div class="mb-4">
				<Label for="email" class="mb-2 dark:text-white">{$_('email')}</Label>
				<Input
					class="bg-white dark:bg-[#1a2232] dark:text-white border-0"
					type="email"
					id="email"
					placeholder={$_('enter-your-email')}
					bind:value={email}
					required
				/>
			</div>

			<div class="mb-6">
				<Label for="password" class="mb-2 dark:text-white">{$_('password')}</Label>
				<Input
					class="bg-white dark:bg-[#1a2232] dark:text-white border-0"
					type="password"
					id="password"
					placeholder={$_('enter-your-password')}
					bind:value={password}
					required
				/>
			</div>

			<Button
				type="submit"
				class="w-full bg-blue hover:bg-sky-500 duration-300 ease-in-out"
				disabled={isLoading}
			>
				{isLoading ? $_('signing-in') : $_('sign-in')}
			</Button>
		</form>
	</Card>
</div>
