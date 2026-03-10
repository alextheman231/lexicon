import { parseBoolean } from "@alextheman/utility";
import { execa } from "execa";

const dockerFile = "docker-compose.test.yml";

export async function setup() {
  if (!parseBoolean(process.env.CI ?? "false")) {
    await execa`docker compose -f ${dockerFile} up -d`;
    await execa`pnpm run migrate-db`;
  }
}

export async function teardown() {
  if (!parseBoolean(process.env.CI ?? "false")) {
    await execa`docker compose -f ${dockerFile} down`;
  }
}
