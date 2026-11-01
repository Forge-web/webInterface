import { Pool } from "pg";

export default defineNitroPlugin((nitroApp) => {
	nitroApp.hooks.hook("close", async () => {
		const globalForDb = globalThis as unknown as { pool?: Pool };
		if (globalForDb.pool) {
			await globalForDb.pool.end();
		}
	});
});
