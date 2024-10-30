import type { ListOption } from '$lib/Models/Common/ListOption';
import type { Event, InsertEvent, UpdateEvent } from '$lib/Supabase/Types/database.types';
import type { IEvent } from '../Interface/IEvent';
import { supabase } from '$lib/Supabase/supabase';
import type { EventEntity } from '$lib/Models/Entities/Event';
import { toastStore } from '$lib/Stores/Toast';
import { get } from 'svelte/store';
import { _ } from 'svelte-i18n';

export class EventRepository implements IEvent {
	async createEventAsync(event: InsertEvent): Promise<EventEntity> {
		const response = await supabase
			.from('Event')
			.insert(event)
			.select('*')
			.returns<EventEntity>()
			.single();
		if (response.error) {
			throw response.error;
		}
		return response.data;
	}
	async getEventAsync(id: number): Promise<EventEntity> {
		const response = await supabase
			.from('Event')
			.select('*,place(id,en,ar,ckb)')
			.eq('id', id)
			.is('deleted_at', null)
			.returns<EventEntity>()
			.single();
		if (response.error) {
			throw response.error;
		}
		return response.data;
	}
	async getEventsAsync(_option?: ListOption): Promise<EventEntity[]> {
		const response = await supabase
			.from('Event')
			.select('*,place(*)')
			.is('deleted_at', null)
			.returns<EventEntity[]>();
		if (response.error) {
			throw response.error;
		}
		return response.data;
	}
	async updateEventAsync(event: UpdateEvent): Promise<EventEntity> {
		const response = await supabase
			.from('Event')
			.update(event)
			.eq('id', event.id!)
			.select('*')
			.returns<EventEntity>()
			.single();
		if (response.error) {
			throw response.error;
		}
		return response.data;
	}
	async deleteEventAsync(id: number): Promise<void> {
		await supabase.from('Event').update({ deleted_at: new Date().toUTCString() }).eq('id', id);
	}

	async getLatestEventAsync(): Promise<EventEntity | null> {
		const response = await supabase
			.from('Event')
			.select('*,place(*)')
			.is('deleted_at', null)
			.order('created_at', { ascending: false })
			.limit(1)
			.returns<EventEntity>()
			.single();

		if (response.error) {
			toastStore.showToast(get(_)('no-event-found'), 'warning');
			return null;
		}
		return response.data;
	}
}
