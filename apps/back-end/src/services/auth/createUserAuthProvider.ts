import type { UserAuthProviderInsertData } from "@lexicon/models";

import type { Connection } from "src/database/connection";
import type { AuthProviderSchema } from "src/database/schema";

import insertUserAuthProvider from "src/models/auth/insertUserAuthProvider";

async function createUserAuthProvider(
  connection: Connection,
  data: UserAuthProviderInsertData,
): Promise<AuthProviderSchema> {
  const userAuthProvider = await insertUserAuthProvider(connection, data);
  return userAuthProvider;
}

export default createUserAuthProvider;
