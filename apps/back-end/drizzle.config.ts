import type { Config } from "drizzle-kit";
import dotenv from "dotenv";
import { parseEnv } from "@alextheman/utility";
import path from "node:path";

const ENV = parseEnv(process.env.NODE_ENV ?? "development");

if (ENV !== "production") {
  dotenv.config({
    path: path.resolve(process.cwd(), `.env.${ENV}`),
    quiet: ENV === "test",
  });
}

const config: Config = {
  schema: "./src/database/schema/index.ts",
  out: "./src/database/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
};

export default config;
