import { writable } from 'svelte/store';

type ToastType = 'success' | 'error' | 'warning' | 'default';

interface ToastState {
	message: string;
	type: ToastType;
	visible: boolean;
}

function createToastStore() {
	const { subscribe, set, update } = writable<ToastState>({
		message: '',
		type: 'default',
		visible: false
	});

	let toastTimeout: NodeJS.Timeout;

	function showToast(message: string, type: ToastType = 'default', duration: number = 3000) {
		clearTimeout(toastTimeout);
		set({ message, type, visible: true });
		toastTimeout = setTimeout(() => {
			update((t) => ({ ...t, visible: false }));
		}, duration);
	}

	return {
		subscribe,
		showToast
	};
}

export const toastStore = createToastStore();
