"use server";
import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs";
import path from "path";

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};
const s3Client = new S3Client([
  {
    region: process.env.AWS_REGION,
    credentials,
  },
]);

const { NEXT_PUBLIC_S3_REC_BUCKET_NAME } = process.env;

export async function uploadS3Rec(formData: FormData) {
  const file = formData.get("file") as File;
  const uploadedBy = formData.get("uploadedBy") as string;
  const fileName = formData.get("fileName") as string;

  if (!NEXT_PUBLIC_S3_REC_BUCKET_NAME) {
    throw new Error("S3 bucket not found");
  }

  // verify file size is smaller than 10,000kb
  if (file.size > 10000000) {
    console.log(`file ${file.name} size: ${file.size} is too large`);
    throw new Error("File size too large");
  }

  const fileContent = await file.arrayBuffer();
  const body = new Uint8Array(fileContent);

  const timestamp = Date.now();
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayMonthYear = `${day}-${month}-${year}`;

  const params = {
    Bucket: NEXT_PUBLIC_S3_REC_BUCKET_NAME,
    Key: `${uploadedBy} (${dayMonthYear}) | ${fileName}.mythrec`,
    Body: body,
    Metadata: {
      "uploaded-by": uploadedBy,
      "file-name": file.name,
    },
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    return;
  } catch (err) {
    throw new Error("Error uploading file");
  }
}

interface ListObjectsV2CommandParams {
  Bucket: string;
  MaxKeys: number;
  ContinuationToken?: string | undefined;
}
export async function listS3Recs(
  pageSize: number = 50,
  continuationToken: string | undefined = undefined
): Promise<any> {
  // todo- add pagination and fetch next recs
  try {
    const params: ListObjectsV2CommandParams = {
      Bucket: NEXT_PUBLIC_S3_REC_BUCKET_NAME || "",
      MaxKeys: pageSize,
      ContinuationToken: continuationToken,
    };

    const data = await s3Client.send(new ListObjectsV2Command(params));
    if (data.NextContinuationToken) {
      params.ContinuationToken = data.NextContinuationToken;
    }

    return {
      contents: data.Contents,
      nextContinuationToken: data.NextContinuationToken,
    };
  } catch (err) {
    console.error("Error listing files:", err);
    throw new Error("Error listing files");
  }
}

export async function downloadS3File(
  recKey: string,
  bucketName: string
): Promise<string> {
  const params = {
    Bucket: bucketName,
    Key: recKey,
  };
  try {
    const command = new GetObjectCommand(params);
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    return signedUrl;
  } catch (err) {
    throw new Error("Error downloading file");
  }
}
