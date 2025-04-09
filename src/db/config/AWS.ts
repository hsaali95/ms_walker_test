import {
  ACCESS_KEY_ID,
  SECRET_ACCESS_KEY,
  S3_END_POINT,
  REGION,
} from "@/utils/constant";

import { S3Client } from "@aws-sdk/client-s3";

const credentials: any = {
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
};

const client = new S3Client({
  region: REGION,
  endpoint: S3_END_POINT,
  credentials,
});

export default client;
