import type { InferSelectModel } from "drizzle-orm";
import type { AnyPgTable } from "drizzle-orm/pg-core";

export interface byTable {
	<T extends AnyPgTable>(table: T): Promise<InferSelectModel<T>[]>;
}
