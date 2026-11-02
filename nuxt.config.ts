import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ["@nuxt/icon/module"],
	compatibilityDate: "2025-07-15",
	css: ["~/assets/css/main.css"],
	devtools: { enabled: true },
	vite: {
		plugins: [tailwindcss()],
	},
	extends: ["schemas-pg/schemas"],
	runtimeConfig: {
		databaseUrl: process.env.DATABASE_URL,
	},
});
