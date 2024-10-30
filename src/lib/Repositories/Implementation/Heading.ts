import type { ListOption } from '$lib/Models/Common/ListOption';
import type { HeadingEntity } from '$lib/Models/Entities/Heading';
import type { HeadingEnum, InsertHeading, UpdateHeading } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { IHeading } from '../Interface/IHeading';
import { supabase } from '$lib/Supabase/supabase';
import { toastStore } from '$lib/Stores/Toast';
import { get } from 'svelte/store';
import { _ } from 'svelte-i18n';

export class HeadingRepository implements IHeading {
	async createHeadingAsync(heading: InsertHeading): Promise<HeadingEntity> {
		const response = await supabase
			.from('Heading')
			.insert(heading)
			.select('*,title(id,en,ckb)')
			.returns<HeadingEntity>()
			.single();
		if (response.error) {
			toastStore.showToast(response.error.message, 'error');
			throw response.error;
		}
		return response.data;
	}
	async getHeadingAsync(id: number): Promise<HeadingEntity> {
		const response = await supabase
			.from('Heading')
			.select('*,title(id,en,ckb)')
			.eq('id', id)
			.returns<HeadingEntity>()
			.single();
		if (response.error) {
			toastStore.showToast(response.error.message, 'error');
			throw response.error;
		}
		return response.data;
	}
	async getHeadingByTypeAsync(type: HeadingEnum): Promise<HeadingEntity | null> {
		const response = await supabase
			.from('Heading')
			.select('*,title(id,en,ckb)')
			.eq('heading_type', type)
			.returns<HeadingEntity>()
			.single();
		console.log('response', response);
		if (response.error) {
			toastStore.showToast(get(_)('no-heading-found'), 'warning');
			return null;
		}
		return response.data;
	}
	async getHeadingsAsync(option?: ListOption): Promise<PostgrestSingleResponse<HeadingEntity[]>> {
		const response = await supabase
			.from('Heading')
			.select('*,title(id,en,ckb)')
			.returns<HeadingEntity[]>();
		if (response.error) {
			toastStore.showToast(response.error.message, 'error');
			throw response.error;
		}
		return response;
	}
	async updateHeadingAsync(heading: UpdateHeading): Promise<HeadingEntity> {
		const response = await supabase
			.from('Heading')
			.update(heading)
			.eq('id', heading.id!)
			.select('*,title(id,en,ckb)')
			.returns<HeadingEntity>()
			.single();
		if (response.error) {
			toastStore.showToast(response.error.message, 'error');
			throw response.error;
		}
		return response.data;
	}
	async deleteHeadingAsync(id: number): Promise<void> {
		const response = await supabase.from('Heading').delete().eq('id', id);
		if (response.error) {
			toastStore.showToast(response.error.message, 'error');
			throw response.error;
		}
	}
}
