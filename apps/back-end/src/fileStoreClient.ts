import { S3Client } from "@aws-sdk/client-s3";

const fileStoreClient = new S3Client({
  region: process.env.AWS_REGION!,
});

export default fileStoreClient;
