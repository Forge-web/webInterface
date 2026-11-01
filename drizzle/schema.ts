import { pgTable, pgEnum, bigserial, uuid, serial, varchar, bigint, numeric, timestamp, integer, text, index, foreignKey, primaryKey, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const type = pgEnum("type", ["Поставка", "Продажа", "Возврат"])


export const invoice = pgTable("invoice", {
	id: uuid().defaultRandom().primaryKey(),
	invoiceType: type("invoice_type").default("Поставка").notNull(),
	invoiceSum: numeric("invoice_sum", { precision: 10, scale: 2 }),
	updateAt: timestamp("update_at"),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const organizations = pgTable("organizations", {
	id: uuid().defaultRandom().primaryKey(),
	name: varchar({ length: 255 }),
	legalForm: varchar("legal_form", { length: 20 }),
	updateAt: timestamp("update_at"),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const paymentTypes = pgTable("payment_types", {
	id: serial().primaryKey(),
	name: varchar({ length: 255 }),
	updateAt: timestamp("update_at"),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const productItems = pgTable("product_items", {
	id: uuid().defaultRandom().primaryKey(),
	productId: bigint("product_id", { mode: 'number' }).notNull().references(() => products.id, { onDelete: "restrict" } ),
	invoiceId: uuid("invoice_id").notNull().references(() => invoice.id, { onDelete: "set null" } ),
	quantity: numeric({ precision: 10, scale: 2 }).notNull(),
	price: numeric({ precision: 10, scale: 2 }),
	updateAt: timestamp("update_at"),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
	quantitySum: numeric("quantity_sum", { precision: 10, scale: 2 }).generatedAlwaysAs(sql`(quantity * price)`),
}, (table) => [
	index("product_items_idx").using("btree", table.id.asc().nullsLast()),
	index("product_items_invoice_idx").using("btree", table.invoiceId.asc().nullsLast()),
	index("product_items_product_idx").using("btree", table.productId.asc().nullsLast()),
]);

export const productTypes = pgTable("product_types", {
	id: serial().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	updateAt: timestamp("update_at"),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
}, (table) => [
	unique("product_types_id_key").on(table.id),	unique("product_types_name_key").on(table.name),]);

export const products = pgTable("products", {
	id: bigserial({ mode: 'number' }).primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	productType: integer("product_type").references(() => productTypes.id, { onDelete: "cascade" } ),
	price: numeric({ precision: 10, scale: 2 }).notNull(),
	updateAt: timestamp("update_at"),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
}, (table) => [
	index("products_idx").using("btree", table.id.asc().nullsLast()),
]);

export const receiptPositions = pgTable("receipt_positions", {
	id: uuid().defaultRandom().primaryKey(),
	productItemsId: uuid("product_items_id").references(() => productItems.id, { onDelete: "set null" } ),
	productId: bigint("product_id", { mode: 'number' }).references(() => products.id, { onDelete: "set null" } ),
	receiptId: uuid("receipt_id").notNull().references(() => receipts.id, { onDelete: "restrict" } ),
	name: varchar({ length: 255 }).notNull(),
	quantity: numeric({ precision: 10, scale: 2 }).notNull(),
	price: numeric({ precision: 10, scale: 2 }).notNull(),
	sum: numeric({ precision: 10, scale: 2 }).generatedAlwaysAs(sql`(price * quantity)`),
	updateAt: timestamp("update_at"),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
}, (table) => [
	index("receipt_positions_idx").using("btree", table.id.asc().nullsLast()),
	index("receipt_positions_product_idx").using("btree", table.productId.asc().nullsLast()),
	index("receipt_positions_receipt_idx").using("btree", table.receiptId.asc().nullsLast()),
]);

export const receipts = pgTable("receipts", {
	id: uuid().defaultRandom().primaryKey(),
	usersId: uuid("users_id").notNull().references(() => users.id),
	organizationsId: uuid("organizations_id").references(() => organizations.id, { onDelete: "set null" } ),
	paymentTypes: integer("payment_types").notNull().references(() => paymentTypes.id),
	checkSum: numeric("check_sum", { precision: 10, scale: 2 }).notNull(),
	updateAt: timestamp("update_at"),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
}, (table) => [
	index("receipts_organizations_idx").using("btree", table.organizationsId.asc().nullsLast()),
	index("receipts_user_idx").using("btree", table.usersId.asc().nullsLast()),
]);

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey(),
	username: varchar({ length: 50 }).notNull(),
	email: varchar({ length: 120 }).notNull(),
	passwordHash: text("password_hash").notNull(),
	updateAt: timestamp("update_at"),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
}, (table) => [
	index("users_idx").using("btree", table.id.asc().nullsLast()),
	index("users_username").using("btree", table.username.asc().nullsLast()),
	unique("users_email_key").on(table.email),	unique("users_username_key").on(table.username),]);
