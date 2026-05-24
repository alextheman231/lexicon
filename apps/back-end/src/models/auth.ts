import type { AuthProvider } from "@lexicon/models";

import type { Connection } from "src/database/connection";
import type { AuthProviderInsert, AuthProviderSchema } from "src/database/schema";

import { parseAuthProviderSchema } from "@lexicon/models";
import { and, eq } from "drizzle-orm";

import { authProvidersTable } from "src/database/schema";

export interface SelectAuthProviderQuery {
  provider?: AuthProvider;
  providerUserId?: string;
}

export async function selectAuthProvider(
  connection: Connection,
  { provider, providerUserId }: SelectAuthProviderQuery,
): Promise<AuthProviderSchema | null> {
  const [authProvider] = await connection
    .select()
    .from(authProvidersTable)
    .where(
      and(
        provider !== undefined ? eq(authProvidersTable.provider, provider) : undefined,
        providerUserId !== undefined
          ? eq(authProvidersTable.providerUserId, providerUserId)
          : undefined,
      ),
    );

  return authProvider ? parseAuthProviderSchema(authProvider) : null;
}

export async function insertAuthProvider(
  connection: Connection,
  data: AuthProviderInsert,
): Promise<AuthProviderSchema> {
  const [newProvider] = await connection.insert(authProvidersTable).values(data).returning();
  return parseAuthProviderSchema(newProvider);
}
