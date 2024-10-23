import { MatchModel } from "@/db/mongo/model/MatchModel";
import getMongoClient from "@/db/mongo/mongo-client";
import { getPatchDates } from "@/utils/getPatchDates";

export interface IFetchUserGodStatsParams {
  playerId: number;
  patchDescription?: string;
  civilization?: number;
  gameMode?: string;
}

export async function getUserGodStats(params: IFetchUserGodStatsParams) {
  await getMongoClient();
  const { playerId, patchDescription, civilization, gameMode } = params;
  
  let matchQuery: any = {
    "teams.results.profile_id": playerId,
  };

  if (patchDescription) {
    const { startDate, endDate } = await getPatchDates(patchDescription);
    matchQuery.matchDate = {
      $gte: startDate.getTime(),
      $lt: endDate.getTime(),
    };
  }

  if (gameMode) {
    matchQuery.gameMode = gameMode;
  }

  // Aggregation pipeline to calculate the stats on the server
  const pipeline = [
    { $match: matchQuery },
    {
      $unwind: "$teams"
    },
    {
      $unwind: "$teams.results"
    },
    {
      $match: {
        "teams.results.profile_id": playerId,
        ...(civilization && { "teams.results.civilization_id": civilization })
      }
    },
    {
      $group: {
        _id: {
          civilization_id: "$teams.results.civilization_id",
          race_id: "$teams.results.race_id",
          gameMode: "$gameMode"
        },
        wins: {
          $sum: {
            $cond: [{ $eq: ["$teams.results.resulttype", 1] }, 1, 0]
          }
        },
        losses: {
          $sum: {
            $cond: [{ $ne: ["$teams.results.resulttype", 1] }, 1, 0]
          }
        },
        totalGames: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: "$_id.civilization_id",
        race_id: { $first: "$_id.race_id" },
        total_wins: { $sum: "$wins" },
        total_games: { $sum: "$totalGames" }
      }
    },
    {
      $project: {
        _id: 0,
        civilization_id: "$_id",
        race_id: 1,
        win_rate: { $divide: ["$total_wins", "$total_games"] },
        number_of_games: "$total_games"
      }
    }
  ];

  const stats = await MatchModel.aggregate(pipeline);

  // Get total games played for play_rate calculation
  const totalGamesQuery: any = { ...matchQuery };
  delete totalGamesQuery["teams.results.civilization_id"];  // Remove the civilization filter for total games

  const totalGamesPipeline = [
    { $match: totalGamesQuery },
    {
      $unwind: "$teams"
    },
    {
      $unwind: "$teams.results"
    },
    {
      $match: {
        "teams.results.profile_id": playerId
      }
    },
    {
      $group: {
        _id: "$teams.results.civilization_id",
        totalGames: { $sum: 1 }
      }
    }
  ];

  const totalGamesStats = await MatchModel.aggregate(totalGamesPipeline);
  const totalGamesMap = new Map(totalGamesStats.map((g) => [g._id, g.totalGames]));
  const totalGamesCount = Array.from(totalGamesMap.values()).reduce((acc, count) => acc + count, 0);

  const godStatsArray = stats.map((stat) => ({
    civilization_id: stat.civilization_id,
    race_id: stat.race_id,
    win_rate: stat.win_rate,
    play_rate: (totalGamesMap.get(stat.civilization_id) || 0) / totalGamesCount,
    number_of_games: stat.number_of_games,
  }));

  return godStatsArray;
}
