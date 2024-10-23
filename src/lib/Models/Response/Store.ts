export class Store<T> {
	data: T[] = [];
	total: number = 0;
	pages?: number = 0;
	limit?: number = 10;
	remainingData?: number;
	metadata?: string;
}
