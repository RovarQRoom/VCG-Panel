import type { ListOption } from '$lib/Models/Common/ListOption';
import type { CarouselEntity } from '$lib/Models/Entities/Carousel';
import type { Carousel, InsertCarousel, UpdateCarousel } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

export interface ICarousel {
	createCarouselAsync(carousel: InsertCarousel): Promise<CarouselEntity>;
	getCarouselAsync(id: number): Promise<CarouselEntity>;
	getCarouselsAsync(_option?: ListOption): Promise<PostgrestSingleResponse<CarouselEntity[]>>;
	updateCarouselAsync(carousel: UpdateCarousel): Promise<CarouselEntity>;
	deleteCarouselAsync(id: number): Promise<void>;
}
