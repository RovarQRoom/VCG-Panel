<script lang="ts">
	import { Card, Button, Label, Input, Alert } from 'flowbite-svelte';

	import { authStore } from '$lib/Stores/Authentication';

	import { goto } from '$app/navigation';

	let email: string = '';

	let password: string = '';

	let errorMessage: string = '';

	let isLoading: boolean = false;

	async function handleSignIn() {
		errorMessage = '';

		isLoading = true;

		try {
			await authStore.signIn(email, password);

			goto('/');
		} catch (err) {
			errorMessage =
				err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';

			console.error('Sign-in error:', err);
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-100">
	<Card class="w-full max-w-md">
		<h2 class="text-2xl font-bold mb-6 text-center">Sign In</h2>

		{#if errorMessage}
			<Alert color="red" class="mb-4">
				{errorMessage}
			</Alert>
		{/if}

		<form on:submit|preventDefault={handleSignIn}>
			<div class="mb-4">
				<Label for="email" class="mb-2">Email</Label>

				<Input type="email" id="email" placeholder="Enter your email" bind:value={email} required />
			</div>

			<div class="mb-6">
				<Label for="password" class="mb-2">Password</Label>

				<Input
					type="password"
					id="password"
					placeholder="Enter your password"
					bind:value={password}
					required
				/>
			</div>

			<Button type="submit" class="w-full" disabled={isLoading}>
				{isLoading ? 'Signing In...' : 'Sign In'}
			</Button>
		</form>
	</Card>
</div>
