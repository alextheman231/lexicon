import type { CreateUserSessionData, UserSession } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import { addDaysToDate } from "@alextheman/utility";

import insertUserSession from "src/models/userSessions/insertUserSession";

async function createUserSession(
  connection: Connection,
  data: CreateUserSessionData,
): Promise<UserSession> {
  const today = new Date();
  const userSession = await insertUserSession(connection, {
    ...data,
    createdAt: today,
    expiresAt: data.expiresAt ?? addDaysToDate(today, 7),
  });

  return userSession;
}

export default createUserSession;
