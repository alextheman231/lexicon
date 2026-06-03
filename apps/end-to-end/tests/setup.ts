import { execa } from "execa";

import path from "node:path";

import test from "tests/fixtures";

const REPOSITORY_ROOT = path.join(process.cwd(), "..", "..");

test(process.env.CI ? "Trivial test" : "Reset the database", async () => {
  if (!process.env.CI) {
    await execa({
      cwd: path.join(REPOSITORY_ROOT, "apps", "back-end"),
    })`pnpm run recreate-end-to-end-db`;
  }
});
