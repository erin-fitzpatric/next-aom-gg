"use server";

import { MatchModel } from "@/db/mongo/model/MatchModel";
import getMongoClient from "@/db/mongo/mongo-client";

export interface MatchParams {
  playerId: number;
  startDate: number;
  endDate: number;
}

export async function fetchMatchRatings(params: MatchParams) {
  const { playerId, startDate, endDate } = params;

  await getMongoClient();
  const matchCondition1v1: any = {
    gameMode: "1V1_SUPREMACY",
    [`matchHistoryMap.${playerId}`]: { $exists: true },
  };

  const matchCondition2v2_3v3: any = {
    gameMode: { $in: ["2V2_SUPREMACY", "3V3_SUPREMACY"] },
    [`matchHistoryMap.${playerId}`]: { $exists: true },
  };

  if (startDate && endDate) {
    matchCondition1v1.matchDate = {
      $gte: startDate,
      $lte: endDate,
    };
    matchCondition2v2_3v3.matchDate = {
      $gte: startDate,
      $lte: endDate,
    };
  }

  const matchAggregation = (matchCondition: any) => [
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

  // Fetch 1v1 ratings
  const result1v1 = await MatchModel.aggregate(
    matchAggregation(matchCondition1v1)
  );

  // Fetch 2v2 and 3v3 ratings
  const result2v2_3v3 = await MatchModel.aggregate(
    matchAggregation(matchCondition2v2_3v3)
  );

  // Processing 1v1 data
  const processRatings = (result: any) => {
    if (result.length > 0 && result[0].allNewRatings.length > 0) {
      const allNewRatings = result[0].allNewRatings;
      const step = Math.ceil(allNewRatings.length / 5); // Limit to 5 data points
      return allNewRatings.filter(
        (_: any, index: number) => index % step === 0
      );
    } else {
      return [];
    }
  };

  const sampledRatings1v1 = processRatings(result1v1);
  const sampledRatings2v2_3v3 =
    result2v2_3v3.length > 0 ? result2v2_3v3[0].allNewRatings : [];

  // Calculate average ratings for 2v2 and 3v3 matches
  const avgRatings2v2_3v3 = [];
  const totalMatches = sampledRatings2v2_3v3.length;
  const step = Math.ceil(totalMatches / 5);

  for (let i = 0; i < totalMatches; i += step) {
    const batch = sampledRatings2v2_3v3.slice(i, i + step);
    const average =
      batch.reduce((acc: number, rating: number) => acc + rating, 0) /
      batch.length;
    avgRatings2v2_3v3.push(average);
  }

  const chartData1v1 = sampledRatings1v1.map(
    (rating: number, index: number) => ({
      date: `Match ${index + 1}`,
      rating: rating,
    })
  );

  const chartData2v2_3v3 = avgRatings2v2_3v3.map(
    (rating: number, index: number) => ({
      date: `Match ${index + 1}`,
      rating: rating,
    })
  );
  return {
    chartData1v1,
    chartData2v2_3v3,
  };
}
