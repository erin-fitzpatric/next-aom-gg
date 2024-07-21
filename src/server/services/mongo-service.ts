"use server"

import RecordedGameModel, { IRecordedGame } from "@/db/mongo/model/RecordedGameModel";
import getMongoClient from "@/db/mongo/mongo-client";
import { MythRecs } from "@/types/MythRecs";

export default async  function queryMythRecs(): Promise<MythRecs[]> {
  await getMongoClient();
  try {
    const result: IRecordedGame[] = await RecordedGameModel.find()
      .sort({ createdAt: -1 })
      .limit(12);

    const mythRecs: MythRecs[] = result.map((video) => {
      const mappedPlayerData  = video.playerdata.map((player) => {
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
      })
      return {
        gameGuid: video.gameguid,
        playerData: mappedPlayerData,
        mapName: video.gamemapname,
        createdAt: video.createdAt,
      };
    });
    return mythRecs;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch Myth recordings: " + err);
  }
}