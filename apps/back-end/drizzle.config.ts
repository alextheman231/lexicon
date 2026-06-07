import dotenv from "dotenv";
import type { Config } from "drizzle-kit";
import path from "node:path";
import loadEnvironment from "src/utility/env/loadEnvironment";

const ENV = loadEnvironment();

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
