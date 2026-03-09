import { parseBoolean } from "@alextheman/utility";
import { execa } from "execa";

const dockerFile = "docker-compose.test.yml";

export async function setup() {
  if (!parseBoolean(process.env.CI ?? "false")) {
    await execa({ stdio: "inherit" })`docker compose -f ${dockerFile} up -d`;
    await execa({ stdio: "inherit" })`pnpm run migrate-db`;
  }
}

export async function teardown() {
  if (!parseBoolean(process.env.CI ?? "false")) {
    await execa({ stdio: "inherit", reject: false })`docker compose -f ${dockerFile} down`;
  }
}
