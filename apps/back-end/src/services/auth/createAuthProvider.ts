import type { AuthProviderSchemaData } from "@lexicon/models";

import type { Connection } from "src/database/connection";
import type { AuthProviderSchema } from "src/database/schema";

import { parseAuthProviderSchema } from "@lexicon/models";

import insertAuthProvider from "src/models/auth/insertAuthProvider";

async function createAuthProvider(
  connection: Connection,
  data: AuthProviderSchemaData,
): Promise<AuthProviderSchema> {
  return parseAuthProviderSchema(await insertAuthProvider(connection, data));
}

export default createAuthProvider;
