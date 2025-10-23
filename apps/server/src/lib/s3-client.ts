import { S3Client } from "bun";
import { Env } from "@/env/schema";

export const S3 = new S3Client({
  region: "auto",
  endpoint: `${Env.S3_ENDPOINT}`,
  accessKeyId: Env.ACCESS_KEY_ID,
  secretAccessKey: Env.SECRET_ACCESS_KEY,
});

export const putObject = async ({
  bucket,
  path,
  data,
  contentType,
}: {
  bucket: string;
  path: string;
  data: ArrayBuffer;
  contentType?: string;
}) => {
  try {
    const response = await S3.write(path, data, {
      bucket,
      type: contentType,
    });

    return { success: true, response };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};
