import { AnyPgTable } from "drizzle-orm/pg-core";
import { createFromTable } from "~~/shared/interfaces/byTable";

export default defineEventHandler(async (event) => {
	const createRecords: createFromTable = async (table, values) => {
		const row = await db
			.insert(table as any)
			.values(values as any)
			.returning();
		return row as any;
	};

	const table = getTableByString(getRouterParam(event, "table")!);
	const body = await readBody(event);

	if (!table) return;
	return await createRecords(table, body);
});
