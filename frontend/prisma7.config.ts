import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

loadEnv({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // `prisma generate` loads this config but does not connect to the database.
    // Keep generation working in build environments without DIRECT_URL; Prisma
    // commands that access Supabase still require a configured connection URL.
    url: process.env.DIRECT_URL ?? "",
  },
});
