import type { Router } from "express";

import { assertNotUndefined, UUID_REGEX_PATTERN } from "@alextheman/utility";
import { GetObjectCommand } from "@aws-sdk/client-s3";

import { getConnection } from "src/database/connection";
import fileStoreClient from "src/fileStoreClient";
import selectUser from "src/models/users/selectUser";
import resourceNotFoundError from "src/utility/errors/resourceNotFoundError";
import handleEndpointMiddleware from "src/utility/handlers/handleEndpointMiddleware";

function getUserProfilePictureByUserId(user: Router) {
  user.get(
    RegExp(`^/(?<userId>${UUID_REGEX_PATTERN})/profile-picture`),
    handleEndpointMiddleware<{ userId: string }>(async (request, response) => {
      const connection = getConnection();

      const user = await selectUser(connection, { userId: request.params.userId });
      if (user === null) {
        throw resourceNotFoundError("user", request.params.userId);
      }

      if (user.profilePictureFileKey === null) {
        return response.status(200).send({});
      }

      const file = await fileStoreClient.send(
        new GetObjectCommand({
          Bucket: process.env.FILE_STORE_BUCKET_NAME,
          Key: user.profilePictureFileKey,
        }),
      );

      assertNotUndefined(file.Body);

      if (file.ContentType !== undefined) {
        response.type(file.ContentType);
      }

      const bytes = await file.Body.transformToByteArray();
      response.status(200).send(bytes);
    }),
  );
}

export default getUserProfilePictureByUserId;
