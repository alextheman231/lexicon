import type { Transaction } from "src/database/connection";

import selectUser from "src/models/users/selectUser";
import changeUserPassword from "src/services/users/changeUserPassword";
import expireUserSessions from "src/services/userSessions/expireUserSessions";
import ResourceNotFoundError from "src/utility/errors/ResourceNotFoundError";

async function resetPassword(connection: Transaction, userId: string, password: string) {
  const user = await selectUser(connection, { userId });

  if (user === null) {
    throw new ResourceNotFoundError({ resourceType: "user", resourceId: userId });
  }

  await changeUserPassword(connection, userId, password);
  await expireUserSessions(connection, { userId });
}

export default resetPassword;
