"use server";
import {
  RecordedGameMetadata,
  RecordedGamePlayerMetadata,
} from "@/types/RecordedGameParser";
import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { MythRecDownloadLink } from "../controllers/download-rec-controller";
import { IRecordedGame } from "@/types/RecordedGame";

const isProduction = process.env.NODE_ENV === 'production';

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

const s3Client = new S3Client([
  {
    region: process.env.AWS_REGION,
    credentials,
    ...(isProduction ? {} : {
      endpoint: "http://localhost:9000",
      forcePathStyle: true,
    }),
  },
]);

const { NEXT_PUBLIC_S3_REC_BUCKET_NAME } = process.env;

type UploadS3RecParams = {
  file: File;
  metadata: RecordedGameMetadata;
  userId: string;
};

type UploadS3RecResponse = {
  message: string;
  key: string;
};

/**
 * @deprecated Using client side presigned URL upload instead
 */
export async function uploadRecToS3(
  uploadS3RecParams: UploadS3RecParams
): Promise<UploadS3RecResponse> {
  const { file, metadata, userId } = uploadS3RecParams;
  const { gameGuid } = metadata;

  if (!NEXT_PUBLIC_S3_REC_BUCKET_NAME) {
    throw new Error("S3 bucket not found");
  }

  // verify file size is smaller than 30,000kb
  if (file.size > 30000000) {
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
      "uploaded-by-user-id": userId,
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

export async function downloadS3RecFile(
  rec: IRecordedGame
): Promise<MythRecDownloadLink> {
  let { gameTitle, gameGuid, s3Key } = rec;

  const CURRENT_DATE = Date.now().toString();
  if (gameTitle === "") {
    gameTitle = CURRENT_DATE;
  }
  // URL-encode the gameTitle to handle special characters
  const encodedGameTitle = encodeURIComponent(gameTitle || CURRENT_DATE);
  const key = s3Key || gameGuid + ".mythrec";

  const params = {
    Bucket: NEXT_PUBLIC_S3_REC_BUCKET_NAME || "",
    Key: key,
    ResponseContentDisposition: `attachment; filename="${encodedGameTitle}.mythrec"`,
  };

  try {
    const command = new GetObjectCommand(params);
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    return {
      signedUrl,
    };
  } catch (err: any) {
    throw new Error("Error downloading file", err.message);
  }
}

type DownloadS3FileResponse = {
  signedUrl: string;
};

type DownloadS3FileParams = {
  key: string;
  bucket: string;
  filename?: string;
};

export async function downloadS3File(
  { key, bucket, filename }: DownloadS3FileParams
): Promise<DownloadS3FileResponse> {
  const CURRENT_DATE = Date.now().toString();

  // URL-encode the gameTitle to handle special characters
  const encodedGameTitle = encodeURIComponent(filename || CURRENT_DATE);

  const params = {
    Bucket: bucket || "",
    Key: key,
    ResponseContentDisposition: `attachment; filename="${encodedGameTitle}"`,
  };

  try {
    const command = new GetObjectCommand(params);
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    return {
      signedUrl,
    };
  } catch (err: any) {
    throw new Error("Error downloading file", err.message);
  }
}
