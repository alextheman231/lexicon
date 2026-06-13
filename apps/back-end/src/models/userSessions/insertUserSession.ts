import type { Connection } from "src/database/connection";
import type { UserSession, UserSessionInsert } from "src/database/schema";

import { assertNotNullable } from "@alextheman/utility";

import { userSessionsTable } from "src/database/schema";
import fetchSole from "src/utility/databaseFilters/fetchSole";

async function insertUserSession(
  connection: Connection,
  data: UserSessionInsert,
): Promise<UserSession> {
  const session = await fetchSole(connection.insert(userSessionsTable).values(data).returning());
  assertNotNullable(session);
  return session;
}

export default insertUserSession;
