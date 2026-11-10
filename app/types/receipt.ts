export interface ReceiptPosition {
	id: number;
	name: string;
	sum: string | number;
}

export interface Receipt {
	id: number;
	users_id: string;
	created_at?: string;
	items: ReceiptPosition[];
	check_sum: string;
}
