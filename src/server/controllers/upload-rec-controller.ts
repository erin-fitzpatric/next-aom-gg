import { parseRecordedGameMetadata } from "../recParser";
import { RecordedGameMetadata } from "@/types/RecordedGameParser";
import getMongoClient from "@/db/mongo/mongo-client";
import RecordedGameModel from "@/db/mongo/model/RecordedGameModel";
import { uploadRecToS3 } from "../services/aws";
import { MongooseError } from "mongoose";

export type UploadRecParams = {
  file: File;
  userName: string;
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
  const { file, userName, gameTitle } = params;

  // 1) parse file
  const recGameMetadata: RecordedGameMetadata = await parseRecordedGameMetadata(
    file
  );
  if (recGameMetadata.gameNumPlayers > 2) {
    throw new Error("Only 2 player games are supported");
  }
  const mappedRecGameMetadata = mapRecGameMetadata(recGameMetadata); //cleanup the data

  // 2) save file to mongo, if game guid doesn't already exists
  let result;
  await getMongoClient();
  try {
    const inserted = await RecordedGameModel.create({
      ...mappedRecGameMetadata,
      uploadedBy: userName,
      gameTitle,
    });
    result = inserted.toJSON();
  } catch (error: any) {
    if (error.code === 11000) {
      console.warn("Rec already uploaded to Mongo");
      throw new Error("UNIQUE_KEY_VIOLATION"); // game already uploaded
    }
    // TODO - this will throw on unique constraint violation, but should probably be handled more gracefully
    console.error("Error saving to mongo: ", error);
    throw new Error("Error saving to mongo");
  }

  // 3) upload to S3
  try {
    await uploadRecToS3({
      file: file,
      metadata: {
        ...recGameMetadata,
      },
      userName,
    });
  } catch (error) {
    console.error("Error uploading to s3: ", error);
    // delete from mongo if s3 upload fails
    RecordedGameModel.deleteOne({ gameGuid: recGameMetadata.gameGuid });
    throw new Error("Error uploading to s3");
  }
}
