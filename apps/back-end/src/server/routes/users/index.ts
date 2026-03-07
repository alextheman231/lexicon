import { Router } from "express";

import getUsers from "src/server/routes/users/get";
import loadEndpoints from "src/utility/loadEndpoints";

function users() {
  const usersRouter = Router();

  loadEndpoints(usersRouter, {
    getUsers,
  });

  return usersRouter;
}

export default users;
