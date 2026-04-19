import { parseBoolean } from "@alextheman/utility";
import { execa } from "execa";

export async function setup() {
  if (!process.env.CI && !parseBoolean(process.env.SKIP_RECREATE_DB ?? "false")) {
    await execa`pnpm run recreate-test-db`;
  }
}
