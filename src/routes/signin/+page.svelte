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

<div class="flex items-center justify-center min-h-screen bg-gray-100">
	<Card class="w-full max-w-md">
		<h2 class="text-2xl font-bold mb-6 text-center">{$_('sign-in')}</h2>

		<form on:submit|preventDefault={handleSubmit}>
			<div class="mb-4">
				<Label for="email" class="mb-2">{$_('email')}</Label>
				<Input
					type="email"
					id="email"
					placeholder={$_('enter-your-email')}
					bind:value={email}
					required
				/>
			</div>

			<div class="mb-6">
				<Label for="password" class="mb-2">{$_('password')}</Label>
				<Input
					type="password"
					id="password"
					placeholder={$_('enter-your-password')}
					bind:value={password}
					required
				/>
			</div>

			<Button type="submit" class="w-full" disabled={isLoading}>
				{isLoading ? $_('signing-in') : $_('sign-in')}
			</Button>
		</form>
	</Card>
</div>
