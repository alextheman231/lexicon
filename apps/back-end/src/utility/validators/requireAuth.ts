import { DataError } from "@alextheman/utility/v6";
import { parseUser } from "@lexicon/models";

import { getConnection } from "src/database/connection";
import { selectUser } from "src/services/users";
import { selectUserSession } from "src/services/userSessions";
import handleFallthroughMiddleware from "src/utility/handleFallthroughMiddleware";

const requireAuth = handleFallthroughMiddleware(async (request) => {
  const connection = getConnection();
  const sessionId = request.cookies.session;
  if (!sessionId) {
    throw new DataError(
      { sessionId },
      "AUTH_REQUIRED",
      "Expected to find a session but none was found.",
    );
  }

  const session = await selectUserSession(connection, sessionId);

  if (session === null || session.expiresAt < new Date()) {
    throw new DataError(
      { sessionId },
      "AUTH_REQUIRED",
      "Expected to find a session but none was found.",
    );
  }

  request.user = parseUser(await selectUser(connection, session.userId));
});

export default requireAuth;
