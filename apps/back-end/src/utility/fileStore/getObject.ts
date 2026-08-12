import type { GetObjectCommandInput } from "@aws-sdk/client-s3";

import { GetObjectCommand } from "@aws-sdk/client-s3";

function getFileStoreObject(commandInput: Omit<GetObjectCommandInput, "Bucket">) {
  return new GetObjectCommand({
    Bucket: process.env.FILE_STORE_BUCKET_NAME,
    ...commandInput,
  });
}

export default getFileStoreObject;
