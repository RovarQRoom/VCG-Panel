import type { ListOption } from '$lib/Models/Common/ListOption';
import type { RouteEntity } from '$lib/Models/Entities/Route';
import type { InsertRoute, UpdateRoute } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { IRoute } from '../Interface/IRoute';
import { supabase } from '$lib/Supabase/supabase';

export class RouteRepository implements IRoute {
	async createRouteAsync(route: InsertRoute): Promise<RouteEntity> {
		const response = await supabase
			.from('Route')
			.insert(route)
			.select('*')
			.returns<RouteEntity>()
			.single();

		if (response.error) {
			throw response.error;
		}
		return response.data;
	}

	async getRouteAsync(id: number): Promise<RouteEntity> {
		const response = await supabase
			.from('Route')
			.select('*, name(id, ckb, en)')
			.eq('id', id)
			.is('deleted_at', null)
			.returns<RouteEntity>()
			.single();

		if (response.error) {
			throw response.error;
		}
		return response.data;
	}

	async getRoutesAsync(_option?: ListOption): Promise<PostgrestSingleResponse<RouteEntity[]>> {
		const response = await supabase
			.from('Route')
			.select(`*, name(id, ${_option?.language ?? 'en'})`, {
				count: 'exact'
			})
			.is('deleted_at', null)
			.order('id', { ascending: false })
			.range(
				((_option?.page ?? 1) - 1) * (_option?.limit ?? 10),
				(_option?.page ?? 1) * (_option?.limit ?? 10)
			)
			.returns<RouteEntity[]>();

		if (response.error) {
			throw response.error;
		}
		return response;
	}

	async updateRouteAsync(route: UpdateRoute): Promise<RouteEntity> {
		const response = await supabase
			.from('Route')
			.update(route)
			.eq('id', route.id!)
			.select('*, name(id, ckb, en)')
			.returns<RouteEntity>()
			.single();

		if (response.error) {
			throw response.error;
		}
		return response.data;
	}

	async deleteRouteAsync(id: number): Promise<void> {
		await supabase.from('Route').update({ deleted_at: new Date().toUTCString() }).eq('id', id);
	}
}
