import type { Config } from "drizzle-kit";

export default {
  schema: "./libs/schema.ts",
  out: "./libs/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
  },
} satisfies Config;
