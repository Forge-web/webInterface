import { eq } from "drizzle-orm";
import { AnyPgTable, getTableConfig } from "drizzle-orm/pg-core";
import * as schemas from "schemas-pg";
import { db } from "~~/server/utils/db";
import { byTable } from "#shared/interfaces/byTable";

export default defineEventHandler(async (event) => {
	const getRecords: byTable = async (table) => {
		const records = await db.select().from(table);
		return records;
	};

	const table = getRouterParam(event, "table");
	if (table === undefined) return;
	const resultRecords = await getRecords(getTableByString(table));
	return resultRecords;
});
