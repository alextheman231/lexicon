import type { Config } from "drizzle-kit";
import dotenv from "dotenv";
import path from "node:path";
import parseEnv from "src/utility/miscellaneous/parseEnv";

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
