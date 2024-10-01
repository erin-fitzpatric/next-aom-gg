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
  const matchCondition: any = {
    gameMode: game_mode,
    [`matchHistoryMap.${profile_id}`]: { $exists: true },
  };

  if (startDate && endDate) {
    matchCondition.matchDate = {
      $gte: startDate,
      $lte: endDate,
    };
  }
  const matchAggregation = [
    {
      $match: matchCondition,
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
    const allNewRatings = result[0].allNewRatings;
    const step = Math.ceil(allNewRatings.length / 6);
    const sampledRatings = allNewRatings.filter(
      (_: any, index: number) => index % step === 0
    );
    const chartData = sampledRatings.map((rating: number, index: number) => ({
      date: `Match ${index + 1}`,
      rating: rating,
    }));
    return chartData;
  } else {
    throw new Error(`No match found for profile ID: ${profile_id}`);
  }
}
