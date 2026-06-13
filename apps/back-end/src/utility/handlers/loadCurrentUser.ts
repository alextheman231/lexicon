import { az } from "@alextheman/utility";
import z from "zod";

import { getConnection } from "src/database/connection";
import selectUser from "src/models/users/selectUser";
import selectUserSession from "src/models/userSessions/selectUserSession";
import handleFallthroughMiddleware from "src/utility/handlers/handleFallthroughMiddleware";

const loadCurrentUser = handleFallthroughMiddleware(async (request) => {
  const connection = getConnection();
  const sessionId = z.uuid().optional().catch(undefined).parse(request.cookies?.session);
  const session = sessionId !== undefined ? await selectUserSession(connection, sessionId) : null;

  const currentUser = session !== null ? await selectUser(connection, session) : null;
  request.user =
    currentUser !== null
      ? {
          ...currentUser,
          dateOfBirth: az.with(z.coerce.date().nullable()).parse(currentUser.dateOfBirth),
        }
      : null;
});

export default loadCurrentUser;
