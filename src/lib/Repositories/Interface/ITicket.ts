import type { TicketEntity } from '$lib/Models/Entities/Ticket';
import type { InsertTicket, UpdateTicket } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

export interface ITicket {
	createTicketAsync(ticket: InsertTicket): Promise<TicketEntity>;
	fetchTicketAsync(id: number): Promise<TicketEntity>;
	fetchAllTicketsAsync(): Promise<PostgrestSingleResponse<TicketEntity[]>>;
	updateTicketAsync(ticket: UpdateTicket): Promise<TicketEntity>;
	deleteTicketAsync(id: number): Promise<void>;
}
