import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./back-end/drizzle/schema.ts",
  out: "./back-end/drizzle/migrations",
  dialect: "postgresql",
  strict: true,
  verbose: true,
  dbCredentials: {
    url: process.env.DRIZZLE_DATABASE_URL as string,
  },
});
