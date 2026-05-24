import type { AuthProviderSchemaData } from "@lexicon/models";
import type { IDToken } from "openid-client";

import type { Connection } from "src/database/connection";
import type { AuthProviderSchema } from "src/database/schema";

import { parseAuthProviderSchema } from "@lexicon/models";

import { insertAuthProvider, selectAuthProvider } from "src/models/auth";

export async function getGoogleAuthUser(
  connection: Connection,
  claims: IDToken,
): Promise<AuthProviderSchema | null> {
  const authProvider = await selectAuthProvider(connection, {
    provider: "google",
    providerUserId: claims.sub,
  });
  return authProvider === null ? null : parseAuthProviderSchema(authProvider);
}

export async function createAuthProvider(
  connection: Connection,
  data: AuthProviderSchemaData,
): Promise<AuthProviderSchema> {
  return parseAuthProviderSchema(await insertAuthProvider(connection, data));
}
