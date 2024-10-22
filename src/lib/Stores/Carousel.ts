import type { CarouselEntity } from '$lib/Models/Entities/Carousel';
import { CarouselRepository } from '$lib/Repositories/Implementation/Carousel';
import type { InsertCarousel, UpdateCarousel } from '$lib/Supabase/Types/database.types';
import { writable } from 'svelte/store';

const carouselRepository = new CarouselRepository();

const createCarouselStore = () => {
	const { subscribe, set, update } = writable<CarouselEntity[]>([]);

	return {
		subscribe,
		fetch: async (id: number) => {
			const response = await carouselRepository.getCarouselAsync(id);
			return response;
		},
		fetchAll: async () => {
			const response = await carouselRepository.getCarouselsAsync();
			set(response);
		},
		insert: async (carousel: InsertCarousel) => {
			const response = await carouselRepository.createCarouselAsync(carousel);
			update((carousels) => [...carousels, response]);
			return response;
		},
		put: async (carousel: UpdateCarousel) => {
			const response = await carouselRepository.updateCarouselAsync(carousel);
			update((carousels) => carousels.map((c) => (c.id === response.id ? response : c)));
		},
		remove: async (id: number) => {
			await carouselRepository.deleteCarouselAsync(id);
			update((carousels) => carousels.filter((c) => c.id !== id));
		}
	};
};

export const carouselStore = createCarouselStore();
