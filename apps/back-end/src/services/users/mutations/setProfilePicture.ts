import type { Connection } from "src/database/connection";

import { PutObjectCommand } from "@aws-sdk/client-s3";

import { randomUUID } from "node:crypto";

import fileStoreClient from "src/fileStoreClient";
import updateUser from "src/models/users/updateUser";
import getProfilePictureFileKey from "src/utility/fileKeys/getProfilePictureFileKey";

export interface ProfilePictureData {
  file: Express.Multer.File;
}

async function setProfilePicture(
  connection: Connection,
  userId: string,
  { file }: ProfilePictureData,
) {
  const profilePictureFileKey = getProfilePictureFileKey({ userId, keyId: randomUUID() });

  await updateUser(connection, userId, {
    profilePictureFileKey,
    profilePictureFileName: file.originalname,
  });
  await fileStoreClient.send(
    new PutObjectCommand({
      Bucket: process.env.FILE_STORE_BUCKET_NAME,
      Key: profilePictureFileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    }),
  );
}

export default setProfilePicture;
