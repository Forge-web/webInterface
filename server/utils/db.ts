// import { Pool } from "pg";
// import { drizzle } from "drizzle-orm/node-postgres";
// import type { NodePgDatabase } from "drizzle-orm/node-postgres";
// import * as schemas from "schemas-pg/schemas/index.ts";

// let _db: NodePgDatabase<typeof schemas> | null = null;

// export function useDb() {
// 	if (!_db) {
// 		const config = useRuntimeConfig();
// 		const pool = new Pool({ connectionString: config.databaseUrl });
// 		_db = drizzle(pool);
// 	}
// 	return _db;
// }
