// db/tables.ts
import * as schemas from "schemas-pg";
import { is } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";

// Фильтруем ключи: оставляем только те, чьё значение — PgTable
type TablesSchema = {
	[K in keyof typeof schemas as (typeof schemas)[K] extends PgTable
		? K
		: never]: (typeof schemas)[K];
};

export default function getTableByString<
	K extends keyof TablesSchema,
>(nameTable: string): TablesSchema[K] {
	const entity = schemas[nameTable as keyof typeof schemas];

	if (!is(entity, PgTable)) {
		throw new Error(
			`"${String(nameTable)}" is not a table (enum, view or unknown entity)`,
		);
	}

	// is() не сужает до конкретного типа из union — нужен cast
	return entity as TablesSchema[K];
}
