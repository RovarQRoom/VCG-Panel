import type { TicketEntity } from '$lib/Models/Entities/Ticket';
import type { InsertTicket, UpdateTicket } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { ITicket } from '../Interface/ITicket';
import { supabase } from '$lib/Supabase/supabase';
import { toastStore } from '$lib/Stores/Toast';
import type { ListOption } from '$lib/Models/Common/ListOption';

export class TicketRepository implements ITicket {
	async createTicketAsync(ticket: InsertTicket): Promise<TicketEntity> {
		const response = await supabase
			.from('Ticket')
			.insert(ticket)
			.select('*')
			.returns<TicketEntity>()
			.single();
		if (response.error) {
			toastStore.showToast(response.error.message, 'error');
			throw new Error(response.error.message);
		}
		return response.data;
	}
	async fetchTicketAsync(id: number): Promise<TicketEntity> {
		const response = await supabase
			.from('Ticket')
			.select('*')
			.eq('id', id)
			.returns<TicketEntity>()
			.single();
		if (response.error) {
			toastStore.showToast(response.error.message, 'error');
			throw new Error(response.error.message);
		}
		return response.data;
	}
	async fetchAllTicketsAsync(
		_option?: ListOption
	): Promise<PostgrestSingleResponse<TicketEntity[]>> {
		const response = await supabase
			.from('Ticket')
			.select(`*,title(${_option?.language ?? 'en'})`)
			.is('deleted_at', null)
			.order('id', { ascending: false })
			.range(
				((_option?.page ?? 1) - 1) * (_option?.limit ?? 10),
				(_option?.page ?? 1) * (_option?.limit ?? 10)
			)
			.returns<TicketEntity[]>();
		if (response.error) {
			toastStore.showToast(response.error.message, 'error');
			throw new Error(response.error.message);
		}
		return response;
	}
	async updateTicketAsync(ticket: UpdateTicket): Promise<TicketEntity> {
		const response = await supabase
			.from('Ticket')
			.update(ticket)
			.select('*')
			.returns<TicketEntity>()
			.single();
		if (response.error) {
			toastStore.showToast(response.error.message, 'error');
			throw new Error(response.error.message);
		}
		return response.data;
	}
	async deleteTicketAsync(id: number): Promise<void> {
		const response = await supabase
			.from('Ticket')
			.update({ deleted_at: new Date().toISOString() })
			.eq('id', id);
		if (response.error) {
			toastStore.showToast(response.error.message, 'error');
			throw new Error(response.error.message);
		}
	}
}
