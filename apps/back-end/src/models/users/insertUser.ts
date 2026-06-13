import type { Connection } from "src/database/connection";
import type { User, UserInsert } from "src/database/schema";

import { assertNotNullable } from "@alextheman/utility";

import { usersTable } from "src/database/schema";
import fetchSole from "src/utility/databaseFilters/fetchSole";

export async function insertUser(connection: Connection, data: UserInsert): Promise<User> {
  const user = await fetchSole(connection.insert(usersTable).values(data).returning());
  assertNotNullable(user);
  return user;
}
