import { execa } from "execa";

import path from "node:path";

if (!process.env.CI) {
  const REPOSITORY_ROOT = path.join(process.cwd(), "..", "..");
  const BACK_END_ROOT = path.join(REPOSITORY_ROOT, "apps", "back-end");

  await execa({
    cwd: REPOSITORY_ROOT,
    stdio: "inherit",
  })`pnpm run build-static`;
  await execa({
    cwd: BACK_END_ROOT,
    stdio: "inherit",
  })`pnpm run recreate-end-to-end-db`;
}
