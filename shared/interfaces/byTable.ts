import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { AnyPgTable } from "drizzle-orm/pg-core";

export interface byTable {
	<T extends AnyPgTable>(table: T): Promise<InferSelectModel<T>[]>;
}

export interface getFromTable {
	<T extends AnyPgTable>(table: T): any;
}

export interface createFromTable {
	<T extends AnyPgTable>(
		table: T,
		values: InferInsertModel<T>,
	): Promise<InferInsertModel<T>>;
}
