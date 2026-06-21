import type { Command } from "commander";

import { execa } from "execa";

import { cp } from "node:fs/promises";
import path from "node:path";

import REPOSITORY_ROOT from "src/constants/REPOSITORY_ROOT";

function buildStatic(program: Command) {
  program
    .command("build-static")
    .description("Build static files and serve them from back-end")
    .action(async () => {
      await execa({
        cwd: path.join(REPOSITORY_ROOT, "apps", "front-end"),
        stdio: "inherit",
      })`pnpm run build`;

      await cp(
        path.join(REPOSITORY_ROOT, "apps", "front-end", "dist"),
        path.join(REPOSITORY_ROOT, "apps", "back-end", "public"),
        { recursive: true },
      );

      await execa({
        cwd: path.join(REPOSITORY_ROOT, "apps", "back-end"),
        stdio: "inherit",
      })`pnpm run build`;
    });
}

export default buildStatic;
