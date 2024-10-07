"use server";

import { MatchModel } from "@/db/mongo/model/MatchModel";
import getMongoClient from "@/db/mongo/mongo-client";
import { CombinedChartData } from "@/types/ChartData";
import { processRatings } from "@/utils/processRating";
import { PipelineStage } from "mongoose";

export interface MatchParams {
  playerId: number;
  startDate: number;
  endDate: number;
}

export async function fetchMatchRatings(
  params: MatchParams
): Promise<CombinedChartData> {
  const { playerId, startDate, endDate } = params;

  await getMongoClient();

  // Define match conditions for 1v1 and 2v2/3v3
  const matchCondition1v1: any = {
    gameMode: "1V1_SUPREMACY",
    [`matchHistoryMap.${playerId}`]: { $exists: true },
  };

  const matchCondition2v2_3v3: any = {
    gameMode: { $in: ["2V2_SUPREMACY", "3V3_SUPREMACY"] },
    [`matchHistoryMap.${playerId}`]: { $exists: true },
  };

  // Add date filtering conditions if provided
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

  // Create aggregation pipeline for 1v1 and 2v2/3v3 matches
  const matchAggregation = (matchCondition: any): PipelineStage[] => {
    return [
      {
        $match: matchCondition,
      },
      {
        $project: {
          matchDate: 1,
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
        $sort: {
          matchDate: 1,
        },
      },
      {
        $group: {
          _id: null,
          allNewRatings: { $push: "$matchHistoryEntries.newrating" },
          allDates: { $push: "$matchDate" },
        },
      },
    ];
  };

  // Fetch 1v1 matches
  const result1v1 = await MatchModel.aggregate(
    matchAggregation(matchCondition1v1)
  );

  // Fetch 2v2 and 3v3 matches
  const result2v2_3v3 = await MatchModel.aggregate(
    matchAggregation(matchCondition2v2_3v3)
  );

  // Process the results for 1v1 and 2v2/3v3
  const chartData1v1 = processRatings(result1v1);
  const chartData2v2_3v3 = processRatings(result2v2_3v3);

  // Return combined chart data
  return {
    chartData: {
      solo: chartData1v1,
      team: chartData2v2_3v3,
    },
  };
}
