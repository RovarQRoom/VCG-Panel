import type { ListOption } from '$lib/Models/Common/ListOption';
import type { RouteEntity } from '$lib/Models/Entities/Route';
import { Store } from '$lib/Models/Response/Store';
import { RouteRepository } from '$lib/Repositories/Implementation/Route';
import type { InsertRoute, UpdateRoute } from '$lib/Supabase/Types/database.types';
import { _ } from 'svelte-i18n';
import { get, writable } from 'svelte/store';
import { toastStore } from './Toast';

const routeRepository = new RouteRepository();

const createRouteStore = () => {
	const { subscribe, set, update } = writable<Store<RouteEntity>>(new Store<RouteEntity>());

	return {
		subscribe,
		fetch: async (id: number) => {
			const response = await routeRepository.getRouteAsync(id);
			return response;
		},
		fetchAll: async (_options?: ListOption) => {
			const response = await routeRepository.getRoutesAsync(_options);
			const pages = Math.ceil(response.count! / (_options?.limit ?? 10));
			set({
				data: response.data ?? [],
				total: response.count!,
				pages: pages,
				limit: _options?.limit ?? 10,
				remainingData: response.data?.length
			});
			return {
				data: response.data ?? [],
				total: response.count!,
				pages: pages,
				limit: _options?.limit ?? 10,
				remainingData: response.data?.length
			};
		},
		insert: async (route: InsertRoute) => {
			try {
				const response = await routeRepository.createRouteAsync(route);
				update((routes) => ({
					...routes,
					data: [...routes.data, response],
					remainingData: routes.remainingData! - 1
				}));
				toastStore.showToast(get(_)('route-created-successfully'), 'success');
				return response;
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
		put: async (route: UpdateRoute) => {
			try {
				const response = await routeRepository.updateRouteAsync(route);
				update((routes) => ({
					...routes,
					data: routes.data.map((r) => (r.id === response.id ? response : r)),
					remainingData: routes.remainingData! - 1
				}));
				toastStore.showToast(get(_)('route-updated-successfully'), 'success');
				return response;
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
		remove: async (id: number) => {
			try {
				await routeRepository.deleteRouteAsync(id);
				update((routes) => ({
					...routes,
					data: routes.data.filter((r) => r.id !== id),
					remainingData: routes.remainingData! - 1
				}));
				toastStore.showToast(get(_)('route-deleted-successfully'), 'success');
			} catch (error) {
				console.error(error);
				throw error;
			}
		}
	};
};

export const routeStore = createRouteStore();
