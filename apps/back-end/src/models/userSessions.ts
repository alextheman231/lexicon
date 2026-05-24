import type { Connection } from "src/database/connection";
import type { UserSession, UserSessionInsert, UserSessionUpdate } from "src/database/schema";

import { eq } from "drizzle-orm";

import { parseUserSession, userSessionsTable } from "src/database/schema";

export async function selectUserSession(
  connection: Connection,
  sessionId: string,
): Promise<UserSession | null> {
  const [session] = await connection
    .select()
    .from(userSessionsTable)
    .where(eq(userSessionsTable.id, sessionId));
  return session ? parseUserSession(session) : null;
}

export async function insertUserSession(
  connection: Connection,
  data: UserSessionInsert,
): Promise<UserSession> {
  const [session] = await connection.insert(userSessionsTable).values(data).returning();
  return parseUserSession(session);
}

export async function updateUserSession(
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
