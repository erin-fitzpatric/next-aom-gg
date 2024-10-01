"use server";

import { MatchModel } from "@/db/mongo/model/MatchModel";
import getMongoClient from "@/db/mongo/mongo-client";

interface MatchParams {
  profile_id: number;
  game_mode: string;
  startDate: number;
  endDate: number;
}

export async function fetchMatchRatings(params: MatchParams) {
  const { profile_id, game_mode, startDate, endDate } = params;

  await getMongoClient();

  const matchAggregation = [
    {
      $match: {
        gameMode: game_mode,
        [`matchHistoryMap.${profile_id}`]: { $exists: true },
        matchDate: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $project: {
        matchHistoryEntries: {
          $ifNull: [`$matchHistoryMap.${profile_id}`, []],
        },
      },
    },
    {
      $unwind: {
        path: "$matchHistoryEntries",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: null,
        allNewRatings: {
          $push: "$matchHistoryEntries.newrating",
        },
      },
    },
  ];

  const result = await MatchModel.aggregate(matchAggregation);

  if (result.length > 0 && result[0].allNewRatings.length > 0) {
    return result[0].allNewRatings;
  } else {
    throw new Error(`No match found for profile ID: ${profile_id}`);
  }
}
