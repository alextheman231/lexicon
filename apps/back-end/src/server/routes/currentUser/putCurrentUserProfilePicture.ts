import type { Router } from "express";

import { APIError } from "@alextheman/utility/v6";

import { getConnection } from "src/database/connection";
import setProfilePicture from "src/services/users/mutations/transaction/setProfilePicture";
import upload from "src/upload";
import handleAuthenticatedEndpointMiddleware from "src/utility/handlers/handleAuthenticatedEndpointMiddleware";

function putCurrentUserProfilePicture(currentUser: Router) {
  currentUser.put(
    "/profile-picture",
    upload.single("file"),
    handleAuthenticatedEndpointMiddleware(async (request, response) => {
      const connection = getConnection();

      await connection.transaction(async (transaction) => {
        if (request.file === undefined) {
          throw new APIError(400, "FILE_NOT_FOUND");
        }

        await setProfilePicture(transaction, request.user.id, { file: request.file });
      });

      response.status(200).send({});
    }),
  );
}

export default putCurrentUserProfilePicture;
