import { parseRecordedGameMetadata } from "../recParser";
import { RecordedGameMetadata } from "@/types/RecordedGameParser";
import getMongoClient from "@/db/mongo/mongo-client";
import RecordedGameModel from "@/db/mongo/model/RecordedGameModel";
import { uploadRecToS3 } from "../services/aws";
import { BuildModel } from "@/db/mongo/model/BuildNumber";
import fs from "fs";
import path from "path";

export type UploadRecParams = {
  file: File;
  userId: string;
  gameTitle: string;
  chunkNumber: number; // New chunk number
  totalChunks: number; // Total number of chunks
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
  const { file, userId, gameTitle, chunkNumber, totalChunks } = params;

  // Directory to temporarily store file chunks
  const tempDir = path.join(__dirname, "uploads", userId);
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const tempFilePath = path.join(tempDir, `${gameTitle}.part`);

  // Write the chunk to the temp file
  const fileBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(fileBuffer);

  // Append or write the chunk
  fs.writeFileSync(tempFilePath, buffer, {
    flag: chunkNumber === 1 ? "w" : "a",
  });

  // If this is not the last chunk, just return and wait for the next chunk
  if (chunkNumber !== totalChunks) {
    return;
  }

  // Once all chunks are uploaded, process the file
  const finalFileBuffer = fs.readFileSync(tempFilePath);

  // 1) parse file after all chunks are received
  const recGameMetadata: RecordedGameMetadata = await parseRecordedGameMetadata(
    new File([finalFileBuffer], gameTitle)
  );
  const mappedRecGameMetadata = mapRecGameMetadata(recGameMetadata);

  // 2) save build number to mongo, if build number doesn't already exist
  await getMongoClient();
  try {
    const existingBuild = await BuildModel.findOne({
      where: { buildNumber: recGameMetadata.buildNumber },
    });

    if (!existingBuild) {
      await BuildModel.create({
        buildNumber: recGameMetadata.buildNumber,
        releaseDate: Date.now(),
      });
    }
  } catch (error) {
    console.error("Error inserting build number:", error);
  }

  // 3) save game metadata to MongoDB, if game GUID doesn't already exist
  await getMongoClient();
  try {
    await RecordedGameModel.create({
      ...mappedRecGameMetadata,
      uploadedByUserId: userId,
      gameTitle,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      console.warn("Rec already uploaded to Mongo");
      throw new Error("UNIQUE_KEY_VIOLATION");
    }
    console.error("Error saving to mongo: ", error);
    throw new Error("Error saving to mongo");
  }

  // 4) upload file to S3 after all chunks are received
  try {
    await uploadRecToS3({
      file: new File([finalFileBuffer], gameTitle),
      metadata: {
        ...recGameMetadata,
      },
      userId,
    });

    // Clean up the temp file after successful upload
    fs.unlinkSync(tempFilePath);
  } catch (error) {
    console.error("Error uploading to S3: ", error);
    // Rollback: Delete from MongoDB if S3 upload fails
    await RecordedGameModel.deleteOne({ gameGuid: recGameMetadata.gameGuid });
    throw new Error("Error uploading to S3");
  }
}
