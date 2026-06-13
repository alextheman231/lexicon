import type { AuthProvider } from "@lexicon/models";

import type { Connection } from "src/database/connection";
import type { AuthProviderSchema } from "src/database/schema";

import { and, eq } from "drizzle-orm";

import { authProvidersTable } from "src/database/schema";
import fetchSole from "src/utility/databaseFilters/fetchSole";

export interface SelectAuthProviderQuery {
  provider?: AuthProvider;
  providerUserId?: string;
}

async function selectUserAuthProvider(
  connection: Connection,
  { provider, providerUserId }: SelectAuthProviderQuery,
): Promise<AuthProviderSchema | null> {
  const authProvider = await fetchSole(
    connection
      .select()
      .from(authProvidersTable)
      .where(
        and(
          provider !== undefined ? eq(authProvidersTable.provider, provider) : undefined,
          providerUserId !== undefined
            ? eq(authProvidersTable.providerUserId, providerUserId)
            : undefined,
        ),
      ),
  );

  return authProvider ?? null;
}

export default selectUserAuthProvider;
