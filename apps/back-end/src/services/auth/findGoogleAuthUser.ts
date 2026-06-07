import type { UserAuthProvider } from "@lexicon/models";
import type { IDToken } from "openid-client";

import type { Connection } from "src/database/connection";

import { az } from "@alextheman/utility";
import { AuthProvider } from "@lexicon/models";
import z from "zod";

import selectUserAuthProvider from "src/models/auth/selectUserAuthProvider";

async function findGoogleAuthUser(
  connection: Connection,
  claims: IDToken,
): Promise<UserAuthProvider | null> {
  const userAuthProvider = await selectUserAuthProvider(connection, {
    provider: "google",
    providerUserId: claims.sub,
  });

  if (userAuthProvider !== null) {
    return {
      ...userAuthProvider,
      provider: az.with(z.enum(AuthProvider)).parse(userAuthProvider.provider),
    };
  }

  return null;
}

export default findGoogleAuthUser;
