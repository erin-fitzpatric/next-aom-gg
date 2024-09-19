import { MatchHistoryStat, Profile } from "@/types/MatchHistory";
import { sortTeams } from "./matchHelpers";
import getMongoClient from "@/db/mongo/mongo-client";
import { MatchModel } from "@/db/mongo/model/MatchModel";
import { Match } from "@/types/Match";

export type FetchMatchHistoryResponse = {
  matchHistoryStats: MatchHistoryStat[];
  profiles: Profile[];
};

export async function fetchMongoMatchHistory(
  playerId: number,
  filters: { skip: number; limit: number }
): Promise<Match[]> {
  const [skip, limit] = [filters.skip, filters.limit];
  await getMongoClient();

  // Build the Pipeline
  const pipeline = [
    {
      $addFields: {
        matchHistoryArray: { $objectToArray: "$matchHistoryMap" },
      },
    },
    {
      $match: {
        "matchHistoryArray.v.profile_id": playerId,
      },
    },
    {
      $project: {
        matchHistoryArray: 0, // Exclude the temporary field
        _id: 0, // Remove BSON _id field
        __v: 0, // Remove __v field
        "teams._id": 0, // Remove BSON _id field inside teams
        "teams.results._id": 0, // Remove BSON _id field inside results
        "matchHistoryMap.v._id": 0, // Remove BSON _id field inside matchHistoryMap
      },
    },
  ];
  // Fetch Data
  const response: Match[] = await MatchModel.aggregate(pipeline)
    .sort({ matchId: -1 })
    .skip(skip)
    .limit(limit);
  return response;
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

// deprecated
// export async function fetchMatchHistory(
//   playerId: string
// ): Promise<FetchMatchHistoryResponse> {
//   const baseUrl =
//     "https://athens-live-api.worldsedgelink.com/community/leaderboard/getRecentMatchHistory";
//   const profileIds = JSON.stringify([playerId]);
//   const url = `${baseUrl}?title=athens&profile_ids=${encodeURIComponent(
//     profileIds
//   )}`;

//   const response = await fetch(url);
//   if (!response.ok) {
//     throw new Error("Failed to fetch profile data");
//   }

//   const data = await response.json();
//   if (data.result.code !== 0) {
//     // No match found for the playerId
//     throw new Error(Errors.PLAYER_NOT_FOUND);
//   }
//   return {
//     matchHistoryStats: data.matchHistoryStats,
//     profiles: data.profiles,
//   };
// }
