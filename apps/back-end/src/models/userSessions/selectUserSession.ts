import type { Connection } from "src/database/connection";
import type { UserSession } from "src/database/schema";

import { eq } from "drizzle-orm";

import { userSessionsTable } from "src/database/schema";
import fetchSole from "src/utility/databaseFilters/fetchSole";

async function selectUserSession(
  connection: Connection,
  sessionId: string,
): Promise<UserSession | null> {
  const session = await fetchSole(
    connection.select().from(userSessionsTable).where(eq(userSessionsTable.id, sessionId)),
  );
  return session ?? null;
}

export default selectUserSession;
