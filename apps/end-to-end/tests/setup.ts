import { execa } from "execa";

import path from "node:path";

import test from "tests/fixtures";

const REPOSITORY_ROOT = path.join(process.cwd(), "..", "..");
const BACK_END_ROOT = path.join(REPOSITORY_ROOT, "apps", "back-end");

test("Setup", async () => {
  await execa({
    cwd: REPOSITORY_ROOT,
  })`pnpm run build-static`;
  await execa({
    cwd: BACK_END_ROOT,
  })`pnpm run recreate-end-to-end-db`;
});
