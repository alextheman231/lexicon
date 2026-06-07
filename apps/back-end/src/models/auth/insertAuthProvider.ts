import type { Connection } from "src/database/connection";
import type { AuthProviderInsert, AuthProviderSchema } from "src/database/schema";

import { assertNotNullable } from "@alextheman/utility";

import { authProvidersTable } from "src/database/schema";

async function insertAuthProvider(
  connection: Connection,
  data: AuthProviderInsert,
): Promise<AuthProviderSchema> {
  const [newProvider] = await connection.insert(authProvidersTable).values(data).returning();
  assertNotNullable(newProvider);
  return newProvider;
}

export default insertAuthProvider;
