import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	invoice: {
		products: r.many.products({
			from: r.invoice.id.through(r.productItems.invoiceId),
			to: r.products.id.through(r.productItems.productId)
		}),
		productItems: r.many.productItems(),
	},
	products: {
		invoices: r.many.invoice(),
		productItems: r.many.productItems(),
		productTypeRelation: r.one.productTypes({
			from: r.products.productType,
			to: r.productTypes.id
		}),
		receiptPositions: r.many.receiptPositions(),
	},
	productItems: {
		invoice: r.one.invoice({
			from: r.productItems.invoiceId,
			to: r.invoice.id
		}),
		product: r.one.products({
			from: r.productItems.productId,
			to: r.products.id
		}),
		receiptPositions: r.many.receiptPositions(),
	},
	productTypes: {
		products: r.many.products(),
	},
	receiptPositions: {
		product: r.one.products({
			from: r.receiptPositions.productId,
			to: r.products.id
		}),
		productItem: r.one.productItems({
			from: r.receiptPositions.productItemsId,
			to: r.productItems.id
		}),
		receipt: r.one.receipts({
			from: r.receiptPositions.receiptId,
			to: r.receipts.id
		}),
	},
	receipts: {
		receiptPositions: r.many.receiptPositions(),
		organization: r.one.organizations({
			from: r.receipts.organizationsId,
			to: r.organizations.id
		}),
		paymentType: r.one.paymentTypes({
			from: r.receipts.paymentTypes,
			to: r.paymentTypes.id
		}),
		user: r.one.users({
			from: r.receipts.usersId,
			to: r.users.id
		}),
	},
	organizations: {
		receipts: r.many.receipts(),
	},
	paymentTypes: {
		receipts: r.many.receipts(),
	},
	users: {
		receipts: r.many.receipts(),
	},
}))