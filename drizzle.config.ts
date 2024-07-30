import type { Config } from "drizzle-kit"

export default {
	schema: "./libs/schema.ts",
	out: "./libs/migrations",
	dialect: "sqlite",
	driver: "turso",
	dbCredentials: {
		url: process.env.TURSO_DATABASE_URL!,
		authToken: process.env.TURSO_AUTH_TOKEN,
	},
} satisfies Config
