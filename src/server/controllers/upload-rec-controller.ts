import { parseRecordedGameMetadata } from "../recParser";
import { uploadRecToS3 } from "../services/aws";
import { RecordedGameMetadata } from "@/types/RecordedGame";
import getMongoClient from "@/db/mongo/mongo-client";
import RecordedGameModel from "@/db/mongo/model/RecordedGameModel";
import { MythRec as MythRec } from "@/types/MythRecs";

export type UploadRecParams = {
  file: File;
  userName: string;
  gameTitle: string;
};

export default async function uploadRec(params: UploadRecParams): Promise<MythRec> {
  const { file, userName, gameTitle } = params;

  // 1) parse file
  const recGameMetadata: RecordedGameMetadata = await parseRecordedGameMetadata(file);


  // 2) save file to mongo, if game guid doesn't already exists
  let result: MythRec;
  await getMongoClient();
  try {
    const inserted = await RecordedGameModel.create(
      {
        ...recGameMetadata,
        uploadedBy: userName, // 1234
        gameTitle: gameTitle,
      }
    );
    result = inserted.toJSON();
  } catch (error: any) {
    // catch unique key violations
    if (error.code === 11000) {
      throw new Error("Unique key violation"); 
    }
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
      userName
    });
  } catch (error) {
    console.error("Error uploading to s3: ", error);
    // delete from mongo if s3 upload fails
    RecordedGameModel.deleteOne({ gameguid: recGameMetadata.gameguid });
    throw new Error("Error uploading to s3");
  }

  return result;
}
