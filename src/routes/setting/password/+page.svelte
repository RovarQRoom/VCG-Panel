<script lang="ts">
	import { Card, Label, Input, Button } from 'flowbite-svelte';
	import { UpdatePasswordRequest } from '$lib/Models/Request/Password';
	import { _ } from 'svelte-i18n';

	let passwordForm: UpdatePasswordRequest = new UpdatePasswordRequest();

	const handlePasswordUpdate = () => {
		// Implement password update logic
	};
</script>

<div class="p-6 ">
	<h2 class="text-2xl font-bold mb-6 dark:text-white">{$_('setting-password')}</h2>
	<div class="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
		<div class="space-y-4">
			<div>
				<Label for="oldPassword" class="mb-2">{$_('current-password')}</Label>
				<Input
					id="oldPassword"
					type="password"
					bind:value={passwordForm.oldPassword}
					placeholder={$_('enter-your-current-password')}
				/>
			</div>

			<div>
				<Label for="newPassword" class="mb-2">{$_('new-password')}</Label>
				<Input
					id="newPassword"
					type="password"
					bind:value={passwordForm.newPassword}
					placeholder={$_('enter-new-password')}
				/>
			</div>

			<div>
				<Label for="confirmPassword" class="mb-2">{$_('confirm-new-password')}</Label>
				<Input
					id="confirmPassword"
					type="password"
					bind:value={passwordForm.confirmPassword}
					placeholder={$_('confirm-new-password')}
				/>
			</div>

			<Button class="w-full" color="primary" on:click={handlePasswordUpdate}>
				{$_('update-password')}
			</Button>
		</div>
	</div>
</div>
