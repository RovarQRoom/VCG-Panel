import type { ListOption } from '$lib/Models/Common/ListOption';
import type { InsertCarousel, UpdateCarousel } from '$lib/Supabase/Types/database.types';
import type { ICarousel } from '../Interface/ICarousel';
import { supabase } from '$lib/Supabase/supabase';
import type { CarouselEntity } from '$lib/Models/Entities/Carousel';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

export class CarouselRepository implements ICarousel {
	async createCarouselAsync(carousel: InsertCarousel): Promise<CarouselEntity> {
		const response = await supabase
			.from('Carousel')
			.insert(carousel)
			.select('*')
			.returns<CarouselEntity>()
			.single();
		if (response.error) {
			throw response.error;
		}
		return response.data;
	}
	async getCarouselAsync(id: number): Promise<CarouselEntity> {
		const response = await supabase
			.from('Carousel')
			.select('*,title(id,en,ar,ckb),description(id,en,ar,ckb),media(id,en,ar,ckb)')
			.eq('id', id)
			.is('deleted_at', null)
			.returns<CarouselEntity>()
			.single();
		if (response.error) {
			throw response.error;
		}
		return response.data;
	}
	async getCarouselsAsync(
		_option?: ListOption
	): Promise<PostgrestSingleResponse<CarouselEntity[]>> {
		const response = await supabase
			.from('Carousel')
			.select(
				`*,title(${_option?.language ?? 'en'}),description(${_option?.language ?? 'en'}),media(${_option?.language ?? 'en'})`,
				{
					count: 'exact'
				}
			)
			.is('deleted_at', null)
			.order('id', { ascending: false })
			.range(
				((_option?.page ?? 1) - 1) * (_option?.limit ?? 10),
				(_option?.page ?? 1) * (_option?.limit ?? 10) - 1
			)
			.returns<CarouselEntity[]>();
		if (response.error) {
			throw response.error;
		}
		return response;
	}
	async updateCarouselAsync(carousel: UpdateCarousel): Promise<CarouselEntity> {
		const response = await supabase
			.from('Carousel')
			.update(carousel)
			.eq('id', carousel.id!)
			.select('*')
			.returns<CarouselEntity>()
			.single();
		if (response.error) {
			throw response.error;
		}
		return response.data;
	}
	async deleteCarouselAsync(id: number): Promise<void> {
		await supabase.from('Carousel').update({ deleted_at: new Date().toUTCString() }).eq('id', id);
	}
}
