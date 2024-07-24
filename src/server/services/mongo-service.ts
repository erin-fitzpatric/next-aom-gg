"use server";

import RecordedGameModel, {
  IRecordedGame,
} from "@/db/mongo/model/RecordedGameModel";
import getMongoClient from "@/db/mongo/mongo-client";
import { MythRec } from "@/types/MythRecs";

export async function queryMythRecs(pageIndex: number): Promise<MythRec[]> {
  console.log("pageIndex", pageIndex);
  const PAGE_SIZE = 2
  const offset = (pageIndex * PAGE_SIZE)
  await getMongoClient();
  try {
    const result: IRecordedGame[] = await RecordedGameModel.find()
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(PAGE_SIZE)

    const mythRecs: MythRec[] = result.map((video) => {
      const mappedPlayerData = video.playerdata.map((player) => {
        return {
          name: player.name,
          team: player.teamid,
          civ: player.civ,
          civList: player.civlist,
          rating: player.rating,
          rank: player.rank,
          powerRating: player.powerrating,
          winRatio: player.winratio,
          civWasRandom: player.civwasrandom,
          color: player.color,
        };
      });
      return {
        gameGuid: video.gameguid,
        playerData: mappedPlayerData,
        mapName: video.gamemapname,
        createdAt: video.createdAt,
        uploadedBy: video.uploadedBy ?? "FitzBro", // remove these defaults later
        gameTitle: video.gameTitle ?? "Retold Rec", // remove these defaults later
        downloadCount: video.downloadCount ?? 0,
      };
    });
    return mythRecs;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch Myth recordings: " + err);
  }
}

export async function incrementDownloadCount(gameGuid: string): Promise<void> {
  await getMongoClient();
  try {
    await RecordedGameModel.updateOne(
      { gameguid: gameGuid },
      { $inc: { downloadCount: 1 } }
    );
  } catch (err) {
    console.error(err);
    throw new Error("Failed to increment download count: " + err);
  }
}
