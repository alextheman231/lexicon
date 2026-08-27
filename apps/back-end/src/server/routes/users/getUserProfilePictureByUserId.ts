import type { Router } from "express";

import { assertNotNull, assertNotUndefined, UUID_REGEX_PATTERN } from "@alextheman/utility";
import { DataError } from "@alextheman/utility/v6";
import { GetObjectCommand } from "@aws-sdk/client-s3";

import { getConnection } from "src/database/connection";
import fileStoreClient from "src/fileStoreClient";
import selectUser from "src/models/users/selectUser";
import getIdsFromProfilePictureFileKey from "src/utility/fileKeys/getIdsFromProfilePictureFileKey";
import handleEndpointMiddleware from "src/utility/handlers/handleEndpointMiddleware";

function getUserProfilePictureByUserId(user: Router) {
  user.get(
    RegExp(`^/(?<userId>${UUID_REGEX_PATTERN})/profile-picture/(?<keyId>${UUID_REGEX_PATTERN})`),
    handleEndpointMiddleware<{ userId: string; keyId: string }>(async (request, response) => {
      const connection = getConnection();

      const user = await selectUser(connection, { userId: request.params.userId });
      assertNotNull(user);
      assertNotNull(user.profilePictureFileKey);

      const fileKeyIds = getIdsFromProfilePictureFileKey(user.profilePictureFileKey);
      assertNotNull(fileKeyIds);

      if (fileKeyIds.keyId !== request.params.keyId) {
        throw new DataError(
          { keyId: request.params.keyId },
          "INCORRECT_FILE_KEY",
          "The provided file key is incorrect",
        );
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
