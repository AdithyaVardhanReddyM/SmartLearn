import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

export default {
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;

// npx drizzle-kit push:pg
