import type { UserSession, UserSessionData } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import { addDaysToDate } from "@alextheman/utility";
import { parseUserSession, parseUserSessionData } from "@lexicon/models";

import { userSessionsTable } from "src/database/schema";

export async function insertUserSession(
  connection: Connection,
  data: UserSessionData,
): Promise<UserSession> {
  const parsedData = parseUserSessionData(data);
  const today = new Date();
  const [session] = await connection
    .insert(userSessionsTable)
    .values({ ...parsedData, createdAt: today, expiresAt: addDaysToDate(today, 7) })
    .returning();
  return parseUserSession(session);
}
