import type { ListOption } from '$lib/Models/Common/ListOption';
import type { EventEntity } from '$lib/Models/Entities/Event';
import type { Event, InsertEvent, UpdateEvent } from '$lib/Supabase/Types/database.types';

export interface IEvent {
	createEventAsync(event: InsertEvent): Promise<EventEntity>;
	getEventAsync(id: number): Promise<EventEntity>;
	getEventsAsync(option?: ListOption): Promise<EventEntity[]>;
	updateEventAsync(event: UpdateEvent): Promise<EventEntity>;
	deleteEventAsync(id: number): Promise<void>;
	getLatestEventAsync(): Promise<EventEntity>;
}
