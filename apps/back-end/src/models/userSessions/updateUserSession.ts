import type { Connection } from "src/database/connection";
import type { UserSession, UserSessionUpdate } from "src/database/schema";

import { eq } from "drizzle-orm";

import { userSessionsTable } from "src/database/schema";
import fetchSole from "src/utility/databaseFilters/fetchSole";

async function updateUserSession(
  connection: Connection,
  sessionId: string,
  data: UserSessionUpdate,
): Promise<UserSession | null> {
  const userSession = await fetchSole(
    connection
      .update(userSessionsTable)
      .set(data)
      .where(eq(userSessionsTable.id, sessionId))
      .returning(),
  );

  return userSession ?? null;
}

export default updateUserSession;
