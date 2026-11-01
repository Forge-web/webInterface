import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schemas from "schemas-pg";

const globalForDb = globalThis as unknown as { pool?: Pool };
const pool =
	globalForDb.pool ??
	new Pool({ connectionString: process.env.DATABASE_URL! });

if (process.env.NODE_ENV !== "production") {
	globalForDb.pool = pool;
}
export const db = drizzle({ client: pool });
