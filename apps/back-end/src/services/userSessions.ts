import type { CreateUserSessionData, UserSession } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import { addDaysToDate } from "@alextheman/utility";
import { parseUserSession } from "@lexicon/models";

import insertUserSession from "src/models/userSessions/insertUserSession";
import updateUserSession from "src/models/userSessions/updateUserSession";

export async function createUserSession(
  connection: Connection,
  data: CreateUserSessionData,
): Promise<UserSession> {
  const today = new Date();
  const userSession = await insertUserSession(connection, {
    ...data,
    createdAt: today,
    expiresAt: data.expiresAt ?? addDaysToDate(today, 7),
  });
  return parseUserSession(userSession);
}

export async function expireUserSession(
  connection: Connection,
  sessionId: string,
): Promise<UserSession | null> {
  const userSession = await updateUserSession(connection, sessionId, { expiresAt: new Date() });
  return parseUserSession(userSession);
}
