"use server";

import { MatchModel } from "@/db/mongo/model/MatchModel";
import getMongoClient from "@/db/mongo/mongo-client";

interface MatchParams {
  playerId: number;
  startDate: number;
  endDate: number;
}

export async function fetchMatchRatings(params: MatchParams) {
  const { playerId, startDate, endDate } = params;

  await getMongoClient();
  const matchCondition: any = {
    gameMode: "1V1_SUPREMACY",
    [`matchHistoryMap.${playerId}`]: { $exists: true },
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
          $ifNull: [`$matchHistoryMap.${playerId}`, []],
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
    throw new Error(`No match found for profile ID: ${playerId}`);
  }
}
