import type { Connection } from "src/database/connection";
import type { User, UserUpdate } from "src/database/schema";

import { eq } from "drizzle-orm";

import { usersTable } from "src/database/schema";

async function updateUser(
  connection: Connection,
  userId: string,
  data: UserUpdate,
): Promise<User | null> {
  const [user] = await connection
    .update(usersTable)
    .set(data)
    .where(eq(usersTable.id, userId))
    .returning();

  return user ?? null;
}

export default updateUser;
