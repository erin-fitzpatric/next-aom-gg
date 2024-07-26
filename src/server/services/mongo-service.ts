"use server";

import RecordedGameModel from "@/db/mongo/model/RecordedGameModel";
import getMongoClient from "@/db/mongo/mongo-client";
import { IRecordedGame } from "@/types/RecordedGame";
import { removeMongoObjectID } from "@/utils/utils";

export async function queryMythRecs(pageIndex: number): Promise<IRecordedGame[]> {
  console.log("pageIndex", pageIndex);
  const PAGE_SIZE = 16
  const offset = (pageIndex * PAGE_SIZE)
  await getMongoClient();
  try {
    const result = await RecordedGameModel.find().lean()
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(PAGE_SIZE)

    // Remove _id from each playerData object and the object as a whole
    // This is a nonserialisable property which will cause React warnings when passed to client
    result.map((rec) => { removeMongoObjectID(rec.playerData)});
    removeMongoObjectID(result);
    return result;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch Myth recordings: " + err);
  }
}

export async function incrementDownloadCount(gameGuid: string): Promise<void> {
  await getMongoClient();
  try {
    await RecordedGameModel.updateOne(
      { gameGuid },
      { $inc: { downloadCount: 1 } }
    );
  } catch (err) {
    console.error(err);
    throw new Error("Failed to increment download count: " + err);
  }
}
