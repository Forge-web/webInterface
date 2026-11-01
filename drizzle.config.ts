import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import * as schema from "schemas-pg";

export default defineConfig({
	out: "./drizzle",
	schema: "./node_modules/schemas-pg/dist/index.js",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
});
