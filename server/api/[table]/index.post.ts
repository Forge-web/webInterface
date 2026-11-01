import { AnyPgTable } from "drizzle-orm/pg-core";

export default defineEventHandler(async (event) => {
	async function createRecords<T extends AnyPgTable>(table: T) {}
});
