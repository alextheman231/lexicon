import { parseBoolean } from "@alextheman/utility";
import { execa } from "execa";

import path from "node:path";

export async function setup() {
  if (!process.env.CI && !parseBoolean(process.env.SKIP_SETUP ?? "false")) {
    await execa({
      cwd: path.join(process.cwd(), "..", "..", "packages", "models"),
    })`pnpm run build`;
    await execa`pnpm run recreate-test-db`;
  }
}
