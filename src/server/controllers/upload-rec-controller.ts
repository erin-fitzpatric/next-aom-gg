import { parseRecordedGameMetadata } from "../recParser";
import { RecordedGameMetadata } from "@/types/RecordedGameParser";
import getMongoClient from "@/db/mongo/mongo-client";
import RecordedGameModel from "@/db/mongo/model/RecordedGameModel";
import { BuildModel } from "@/db/mongo/model/BuildNumber";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export type UploadRecParams = {
  userId: string;
  s3Key: string;
  gameTitle: string;
};

export function mapRecGameMetadata(data: RecordedGameMetadata) {
  const mappedData = data;
  mappedData.playerData = mappedData.playerData.filter(
    (_player, idx) => idx !== 0
  );
  return mappedData;
}

export default async function uploadRec(
  params: UploadRecParams
): Promise<void> {
  const { userId, s3Key, gameTitle } = params;

  // 1) Get file from S3
  const getObjectParams = {
    Bucket: process.env.NEXT_PUBLIC_S3_REC_BUCKET_NAME,
    Key: s3Key,
  };

  const { Body } = await s3Client.send(new GetObjectCommand(getObjectParams));
  if (!Body) {
    throw new Error("Failed to retrieve file from S3");
  }

  const fileBuffer = await Body.transformToByteArray();
  const file = new File([fileBuffer], s3Key.split("/").pop() || "unknown");

  // 2) parse file
  const recGameMetadata: RecordedGameMetadata = await parseRecordedGameMetadata(
    file
  );
  const mappedRecGameMetadata = mapRecGameMetadata(recGameMetadata);

  // Removing this for now, because it messes up the stats since the matches don't have a build number
  // 3) save build number to mongo, if build number doesn't already exist
  // await getMongoClient();
  // try {
  //   const response = await BuildModel.findOne({
  //     buildNumber: recGameMetadata.buildNumber,
  //   });
  //   const existingBuild = response?.toJSON()?.buildNumber;

  //   if (!existingBuild) {
  //     await BuildModel.create({
  //       buildNumber: recGameMetadata.buildNumber,
  //       releaseDate: Date.now(),
  //     });
  //   }
  // } catch (error) {
  //   console.error("Error inserting build number:", error);
  // }

  // 4) save metadata to mongo, if game guid doesn't already exist
  try {
    await RecordedGameModel.create({
      ...mappedRecGameMetadata,
      uploadedByUserId: userId,
      gameTitle,
      s3Key,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      console.warn("Rec already uploaded to Mongo");
      throw new Error("UNIQUE_KEY_VIOLATION");
    }
    console.error("Error saving to mongo: ", error);
    throw new Error("Error saving to mongo");
  }
}
