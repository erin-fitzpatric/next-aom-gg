import { MatchHistoryStat, Profile } from "@/types/MatchHistory";
import getMongoClient from "@/db/mongo/mongo-client";
import { MatchModel } from "@/db/mongo/model/MatchModel";
import { Match, MatchResults } from "@/types/Match";
import { PipelineStage } from "mongoose";
import { sortTeams } from "./matchHelpers";

export type FetchMatchHistoryResponse = {
  matchHistoryStats: MatchHistoryStat[];
  profiles: Profile[];
};

export async function fetchMongoMatchHistory(
  playerId: number,
  filters: { skip: number; limit: number }
): Promise<MatchResults> {
  const { skip, limit } = filters;
  await getMongoClient();

  // Build the Pipeline
  const pipeline: PipelineStage[] = [
    // Match documents first to reduce the result set as much as possible
    {
      $match: {
        [`matchHistoryMap.${playerId}`]: { $exists: true }
      },
    },
    {
      $project: {
        matchHistoryArray: 0,
        _id: 0,
        __v: 0,
        "teams._id": 0,
        "teams.results._id": 0,
        [`matchHistoryMap.${playerId}._id`]: 0, // Exclude BSON _id inside matchHistoryMap
      },
    },
    // Sort, Skip, and Limit
    { $sort: { matchId: -1 } },
    { $skip: skip },
    { $limit: limit },
  ];

  // Fetch Data
  const data = await MatchModel.aggregate(pipeline).exec();
  const totalCount = await MatchModel.countDocuments({
    [`matchHistoryMap.${playerId}`]: { $exists: true }
  });

  return {
    data,
    totalCount,
  };
}


export function mapMatchHistoryData(
  matchData: Match[],
  playerId: number
): Match[] {
  // sort that teams always have the playerId first
  const sortedMatchData = sortTeams(matchData, playerId);

  // calculate the rating change for each match and map it to the match data
  const mappedMatchData = sortedMatchData.map((match) => {
    const playerMatch = match?.matchHistoryMap[playerId];
    const ratingChange =
      playerMatch?.[0].newrating - playerMatch?.[0].oldrating;
    return {
      ...match,
      ratingChange,
    };
  });
  return mappedMatchData;
}