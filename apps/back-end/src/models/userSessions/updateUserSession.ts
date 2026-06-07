import type { Connection } from "src/database/connection";
import type { UserSession, UserSessionUpdate } from "src/database/schema";

import { eq } from "drizzle-orm";

import { parseUserSession, userSessionsTable } from "src/database/schema";

async function updateUserSession(
  connection: Connection,
  sessionId: string,
  data: UserSessionUpdate,
): Promise<UserSession | null> {
  const [userSession] = await connection
    .update(userSessionsTable)
    .set(data)
    .where(eq(userSessionsTable.id, sessionId))
    .returning();

  return userSession ? parseUserSession(userSession) : null;
}

export default updateUserSession;
