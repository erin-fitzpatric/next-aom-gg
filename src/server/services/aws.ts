"use server";
import { RecordedGameMetadata } from "@/types/RecordedGameParser";
import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { MythRecDownloadLink } from "../controllers/download-rec-controller";

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

type UploadS3RecParams = {
  file: File;
  metadata: RecordedGameMetadata;
  userName: string; // depprecate this and use login info l8ter
};

type UploadS3RecResponse = {
  message: string;
  key: string;
};

export async function uploadRecToS3(uploadS3RecParams: UploadS3RecParams): Promise<UploadS3RecResponse> {
  const { file, metadata, userName } = uploadS3RecParams;
  const { gameGuid } = metadata;

  if (!NEXT_PUBLIC_S3_REC_BUCKET_NAME) {
    throw new Error("S3 bucket not found");
  }

  // verify file size is smaller than 15,000kb
  if (file.size > 15000000) {
    console.log(`file ${file.name} size: ${file.size} is too large`);
    throw new Error("File size too large");
  }

  // format file
  const fileContent = await file.arrayBuffer();
  const body = new Uint8Array(fileContent);

  const params = {
    Bucket: NEXT_PUBLIC_S3_REC_BUCKET_NAME,
    Key: `${gameGuid}.mythrec`,
    Body: body,
    Metadata: {
      "uploaded-by": userName,
    },
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    return {
      message: "File uploaded successfully",
      key: `${gameGuid}.mythrec`,
    };
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
  recKey: string
): Promise<MythRecDownloadLink> {
  const params = {
    Bucket: NEXT_PUBLIC_S3_REC_BUCKET_NAME || "",
    Key: recKey + ".mythrec",
  };
  try {
    const command = new GetObjectCommand(params);
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    return {
      signedUrl,
    };
  } catch (err) {
    throw new Error("Error downloading file");
  }
}
