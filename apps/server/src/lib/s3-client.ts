import {
  GetObjectCommand,
  ListBucketsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Env } from "@/env/schema";

export const S3 = new S3Client({
  region: "auto",
  endpoint: `${Env.S3_ENDPOINT}`,
  credentials: {
    accessKeyId: Env.ACCESS_KEY_ID,
    secretAccessKey: Env.SECRET_ACCESS_KEY,
  },
});

export const putObject = async ({
  bucket,
  key,
  body,
  contentType,
}: {
  bucket: string;
  key: string;
  body: Uint8Array | Buffer | string;
  contentType?: string;
}) => {
  try {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    });
    const response = await S3.send(command);
    return { success: true, response };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

export const getObject = async ({
  bucket,
  key,
}: {
  bucket: string;
  key: string;
}) => {
  try {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    const response = await S3.send(command);
    return { success: true, response };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};
