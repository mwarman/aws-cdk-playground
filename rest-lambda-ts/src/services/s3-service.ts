import { Bucket, ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";

import { DEFAULT_AWS_REGION } from "../utils/constants";

const AWS_REGION = process.env.AWS_REGION || DEFAULT_AWS_REGION;
console.log("S3Service::AWS_REGION::", AWS_REGION);

export const listBuckets = async (): Promise<Bucket[]> => {
  const client = new S3Client({ region: AWS_REGION });
  const command = new ListBucketsCommand({});

  try {
    const response = await client.send(command);
    console.log("S3Service::listBuckets::response::", response);
    return response.Buckets || [];
  } catch (error) {
    console.error("S3Service::listBuckets::error::", error);
    throw error;
  }
};
