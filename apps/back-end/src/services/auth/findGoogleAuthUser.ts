import type { AuthProviderSchema } from "@lexicon/models";
import type { IDToken } from "openid-client";

import type { Connection } from "src/database/connection";

import { parseAuthProviderSchema } from "@lexicon/models";

import selectAuthProvider from "src/models/auth/selectAuthProvider";

async function findGoogleAuthUser(
  connection: Connection,
  claims: IDToken,
): Promise<AuthProviderSchema | null> {
  const authProvider = await selectAuthProvider(connection, {
    provider: "google",
    providerUserId: claims.sub,
  });
  return authProvider === null ? null : parseAuthProviderSchema(authProvider);
}

export default findGoogleAuthUser;
