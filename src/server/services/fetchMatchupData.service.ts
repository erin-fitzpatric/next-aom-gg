"use server";

import getMongoClient from "@/db/mongo/mongo-client";
import { GetMatchupDataParams } from "../controllers/stats/matchups";
import { StatsCivsModel } from "@/db/mongo/model/stats/StatsCivsModel";
import { GodStats, MatchData, MatchupStats } from "@/types/CivStats";
import { ALL_ELO_RANGES } from "@/utils/consts";

export async function fetchMatchupData(
  params: GetMatchupDataParams
): Promise<MatchupStats> {
  await getMongoClient();
  const { eloRange, startDate, endDate, godId } = params;

  // match object
  let matchQuery: any = {};

  // elo range
  if (eloRange && eloRange !== "All" && eloRange !== ALL_ELO_RANGES) {
    matchQuery["metaField.elo_bin"] = eloRange;
  }

  // patch dates
  if (startDate && endDate) {
    matchQuery.matchDay = {
      $gte: startDate,
      $lt: endDate,
    };
  }

  // god id
  if (godId) {
    matchQuery["metaField.civ_id"] = godId;
  }

  // TODO -only 1v1 supported...for now
  // game mode
  // if (gameMode) {
  //   matchQuery.gameMode = gameMode;
  // }

  const results: MatchData[] = await StatsCivsModel.find(matchQuery).lean();
  const mappedResults = sumMatchupStatsByGod(results);
  return mappedResults;
}

function sumMatchupStatsByGod(data: MatchData[]): MatchupStats {
  return data.reduce((acc: Record<string, GodStats>, entry: MatchData) => {
    Object.entries(entry.matchups).forEach(([godName, matchup]) => {
      // Initialize the object for the god if it doesn't exist
      if (!acc[godName]) {
        acc[godName] = {
          totalResults: 0,
          totalWins: 0,
        };
      }

      // Sum up the results and wins for the god
      acc[godName].totalResults += matchup.totalResults;
      acc[godName].totalWins += matchup.totalWins;
    });

    return acc;
  }, {});
}

