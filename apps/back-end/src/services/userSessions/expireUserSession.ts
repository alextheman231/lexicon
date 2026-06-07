import type { UserSession } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import { parseUserSession } from "@lexicon/models";

import updateUserSession from "src/models/userSessions/updateUserSession";

async function expireUserSession(
  connection: Connection,
  sessionId: string,
): Promise<UserSession | null> {
  const userSession = await updateUserSession(connection, sessionId, { expiresAt: new Date() });
  return parseUserSession(userSession);
}

export default expireUserSession;
