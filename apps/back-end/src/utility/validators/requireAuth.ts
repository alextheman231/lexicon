import { assertNotNull } from "@alextheman/utility";

import { getConnection } from "src/database/connection";
import { selectUser } from "src/services/users";
import { selectUserSession } from "src/services/userSessions";
import authRequiredError from "src/utility/authRequiredError";
import handleFallthroughMiddleware from "src/utility/handleFallthroughMiddleware";

const requireAuth = handleFallthroughMiddleware(async (request) => {
  const connection = getConnection();
  const sessionId = request.cookies.session;
  if (!sessionId) {
    throw authRequiredError(sessionId);
  }

  const session = await selectUserSession(connection, sessionId);

  if (session === null || session.expiresAt < new Date()) {
    throw authRequiredError(sessionId);
  }
  const currentUser = await selectUser(connection, session.userId);
  assertNotNull(currentUser);
  request.user = currentUser;
});

export default requireAuth;
