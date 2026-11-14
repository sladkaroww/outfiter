import { S3Client } from "@aws-sdk/client-s3";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const bucket = process.env.NEON_STORAGE_BUCKET || "wardrobe-images";

export function getStorageClient() {
  return new S3Client({
    forcePathStyle: true,
    endpoint: process.env.AWS_ENDPOINT_URL_S3,
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  });
}

export async function createUploadUrl(key: string, contentType: string) {
  return getSignedUrl(
    getStorageClient(),
    new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }),
    { expiresIn: 900 },
  );
}

export async function createDownloadUrl(key: string) {
  return getSignedUrl(
    getStorageClient(),
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn: 3600 },
  );
}

export function isStorageKey(value: string) {
  return value.startsWith("wardrobe/");
}
