import type { UserSession } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import { parseUserSession } from "@lexicon/models";
import { eq } from "drizzle-orm";

import { userSessionsTable } from "src/database/schema";

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
