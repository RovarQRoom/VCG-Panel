import type { ListOption } from '$lib/Models/Common/ListOption';
import type { CarouselEntity } from '$lib/Models/Entities/Carousel';
import { Store } from '$lib/Models/Response/Store';
import { CarouselRepository } from '$lib/Repositories/Implementation/Carousel';
import type { InsertCarousel, UpdateCarousel } from '$lib/Supabase/Types/database.types';
import { writable } from 'svelte/store';

const carouselRepository = new CarouselRepository();

const createCarouselStore = () => {
	const { subscribe, set, update } = writable<Store<CarouselEntity>>(new Store<CarouselEntity>());

	return {
		subscribe,
		fetch: async (id: number) => {
			const response = await carouselRepository.getCarouselAsync(id);
			return response;
		},
		fetchAll: async (_options?: ListOption) => {
			const response = await carouselRepository.getCarouselsAsync(_options);
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
		insert: async (carousel: InsertCarousel) => {
			const response = await carouselRepository.createCarouselAsync(carousel);
			update((carousels) => ({
				...carousels,
				data: [...carousels.data, response],
				remainingData: carousels.remainingData! - 1
			}));
			return response;
		},
		put: async (carousel: UpdateCarousel) => {
			const response = await carouselRepository.updateCarouselAsync(carousel);
			update((carousels) => ({
				...carousels,
				data: carousels.data.map((c) => (c.id === response.id ? response : c)),
				remainingData: carousels.remainingData! - 1
			}));
		},
		remove: async (id: number) => {
			await carouselRepository.deleteCarouselAsync(id);
			update((carousels) => ({
				...carousels,
				data: carousels.data.filter((c) => c.id !== id),
				remainingData: carousels.remainingData! - 1
			}));
		}
	};
};

export const carouselStore = createCarouselStore();
