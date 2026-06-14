import type { AuthProvider } from "@lexicon/models";

import type { Connection } from "src/database/connection";
import type { AuthProviderSchema } from "src/database/schema";

import { and } from "drizzle-orm";

import { authProvidersTable } from "src/database/schema";
import fetchSole from "src/utility/databaseFilters/fetchSole";
import maybeEq from "src/utility/databaseFilters/maybeEq";

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
          maybeEq(authProvidersTable.provider, provider),
          maybeEq(authProvidersTable.providerUserId, providerUserId),
        ),
      ),
  );

  return authProvider ?? null;
}

export default selectUserAuthProvider;
