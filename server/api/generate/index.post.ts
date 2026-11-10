import { eq } from "drizzle-orm";
import {
	organizations,
	payment_types,
	product_types,
	products,
	users,
} from "schemas-pg";

import Decimal from "decimal.js";

export default defineEventHandler(async (event) => {
	const options = await readBody(event);
	const quantity = options.quantity;
	const loss = options.loss;

	const isLoss = (loss: number) => {
		return Math.floor(Math.random() * loss) + 1 <= loss;
	};

	function toMoscowISO(date = new Date()) {
		const MSK_OFFSET_MS = 3 * 60 * 60 * 1000;
		const d = new Date(date.getTime() + MSK_OFFSET_MS);
		// d.toISOString() → "2026-11-10T15:42:07.123Z"
		// отрезаем миллисекунды и Z, добавляем offset
		return d.toISOString().slice(0, 19) + "+03:00";
	}

	const getRandomItems = () => {
		let result = [];
		const randomQuantityItem = Math.floor(Math.random() * 15);
		for (let i = 0; i <= randomQuantityItem; i++) {
			const _item =
				_products[Math.floor(Math.random() * _products.length)];
			result.push(_item);
		}
		console.log(`GET RANDOM ITEMS: ${JSON.stringify(result)}`);
		return result;
	};

	const getCheckSum = (items: any[], isLoss: boolean) => {
		let result_sum = new Decimal(0);

		for (const item of items) {
			if (isLoss) {
				result_sum = result_sum.plus(item.sum);
				result_sum = result_sum.plus(Math.floor(Math.random() * 250));
			} else {
				result_sum = result_sum.plus(item.sum);
			}
		}

		return result_sum;
	};

	const _products = await db
		.select({
			id: products.id,
			name: products.name,
			price: products.price,
			quantity: products.quantity,
			sum: products.sum,
			product_types_id: product_types.name,
		})
		.from(products)
		.leftJoin(
			product_types,
			eq(products.product_types_id, product_types.id),
		);

	const _organizations = await db.select().from(organizations);
	const _users = await db.select().from(users);
	const _payment_types = await db.select().from(payment_types);

	const result_receipts = Array(quantity);

	for (let i = 0; i <= quantity - 1; i++) {
		const _isLoss = isLoss(loss);
		const _user = _users[Math.floor(Math.random() * _users.length)];
		const _organization =
			_organizations[
				Math.floor(Math.random() * _organizations.length)
			];
		const _items = getRandomItems();
		const _payment_type =
			_payment_types[
				Math.floor(Math.random() * _payment_types.length)
			];
		const _check_sum = getCheckSum(_items, _isLoss);

		result_receipts[i] = {
			id: crypto.randomUUID(),
			user: _user,
			organization: {
				name: _organization?.name,
				legal_from: _organization?.legal_form,
			},
			payment_type: _payment_type?.name,
			check_sum: _check_sum,
			created_at: toMoscowISO(),
			items: [..._items],
		};
	}
	return {
		receipts: [...result_receipts],
	};
});
