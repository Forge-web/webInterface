type Item = {
	item_id: number;
	name: string;
	price: string;
	quantity: string;
	sum: string;
	product_type: string;
};
type User = {
	user_id: number;
	name: string;
	lastname: string;
	email: string;
};
type Receipt = {
	user: User;
	organization: string;
	legal_form: string;
	payment_type: string;
	check_sum: string;
	created_at: Date;
	items: Item[];
};

export default (receipt: Receipt) => {
	const result_json = JSON.stringify({
		receipt_id: [crypto.randomUUID()],
		...receipt,
	});
	return result_json;
};
