import type { ListOption } from '$lib/Models/Common/ListOption';
import type { RouteEntity } from '$lib/Models/Entities/Route';
import type { InsertRoute, UpdateRoute } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

export interface IRoute {
    createRouteAsync(route: InsertRoute): Promise<RouteEntity>;
    getRouteAsync(id: number): Promise<RouteEntity>;
    getRoutesAsync(option?: ListOption): Promise<PostgrestSingleResponse<RouteEntity[]>>;
    updateRouteAsync(route: UpdateRoute): Promise<RouteEntity>;
    deleteRouteAsync(id: number): Promise<void>;
}
