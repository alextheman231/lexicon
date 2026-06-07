import type { Connection } from "src/database/connection";
import type { UserSession, UserSessionInsert } from "src/database/schema";

import { assertNotNullable } from "@alextheman/utility";

import { userSessionsTable } from "src/database/schema";

async function insertUserSession(
  connection: Connection,
  data: UserSessionInsert,
): Promise<UserSession> {
  const [session] = await connection.insert(userSessionsTable).values(data).returning();
  assertNotNullable(session);
  return session;
}

export default insertUserSession;
