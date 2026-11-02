import { eq } from "drizzle-orm";
import { AnyPgTable, getTableConfig } from "drizzle-orm/pg-core";
import * as schemas from "schemas-pg";
import { db } from "~~/server/utils/db";
import { byTable } from "#shared/interfaces/byTable";

export default defineEventHandler(async (event) => {
	const getRecords = async (table: any, field: any, id: any) => {
		const records = await db
			.select()
			.from(table)
			.where(eq(table[field], id));
		return records;
	};

	const table = getRouterParam(event, "table");
	const field = getRouterParam(event, "field");
	const id = getRouterParam(event, "id");
	if (table === undefined) return;
	const resultRecords = await getRecords(
		getTableByString(table),
		field,
		id,
	);
	return resultRecords;
});
