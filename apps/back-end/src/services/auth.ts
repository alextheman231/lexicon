import type { AuthProviderSchemaData } from "@lexicon/models";
import type { IDToken } from "openid-client";

import type { Connection } from "src/database/connection";
import type { AuthProviderSchema } from "src/database/schema";

import { parseAuthProviderSchema, parseAuthProviderSchemaData } from "@lexicon/models";
import { and, eq } from "drizzle-orm";

import { authProvidersTable } from "src/database/schema";

export async function selectAuthProvider(
  connection: Connection,
  claims: IDToken,
): Promise<AuthProviderSchema | null> {
  const [provider] = await connection
    .select()
    .from(authProvidersTable)
    .where(
      and(
        eq(authProvidersTable.provider, "google"),
        eq(authProvidersTable.providerUserId, claims.sub),
      ),
    );

  return provider ? parseAuthProviderSchema(provider) : null;
}

export async function insertAuthProvider(
  connection: Connection,
  data: AuthProviderSchemaData,
): Promise<AuthProviderSchema> {
  const parsedData = parseAuthProviderSchemaData(data);
  const [newProvider] = await connection.insert(authProvidersTable).values(parsedData).returning();
  return parseAuthProviderSchema(newProvider);
}
