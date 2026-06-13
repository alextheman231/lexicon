import type { Connection } from "src/database/connection";
import type { AuthProviderInsert, AuthProviderSchema } from "src/database/schema";

import { assertNotNullable } from "@alextheman/utility";

import { authProvidersTable } from "src/database/schema";
import fetchSole from "src/utility/databaseFilters/fetchSole";

async function insertUserAuthProvider(
  connection: Connection,
  data: AuthProviderInsert,
): Promise<AuthProviderSchema> {
  const newProvider = await fetchSole(
    connection.insert(authProvidersTable).values(data).returning(),
  );
  assertNotNullable(newProvider);
  return newProvider;
}

export default insertUserAuthProvider;
