import type { UserSession, UserSessionData } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import { addDaysToDate } from "@alextheman/utility";
import { parseUserSession, parseUserSessionData } from "@lexicon/models";
import { eq } from "drizzle-orm";

import { userSessionsTable } from "src/database/schema";

export async function insertUserSession(
  connection: Connection,
  data: UserSessionData,
): Promise<UserSession> {
  const parsedData = parseUserSessionData(data);
  const today = new Date();
  const [session] = await connection
    .insert(userSessionsTable)
    .values({
      ...parsedData,
      createdAt: today,
      expiresAt: data?.expiresAt ?? addDaysToDate(today, 7),
    })
    .returning();
  return parseUserSession(session);
}

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

export async function expireUserSession(
  connection: Connection,
  sessionId: string,
): Promise<UserSession | null> {
  const [userSession] = await connection
    .update(userSessionsTable)
    .set({
      expiresAt: new Date(),
    })
    .where(eq(userSessionsTable.id, sessionId))
    .returning();

  return userSession ? parseUserSession(userSession) : null;
}
