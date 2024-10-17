"use server";

import { MatchModel } from "@/db/mongo/model/MatchModel";
import getMongoClient from "@/db/mongo/mongo-client";
import { CombinedChartData } from "@/types/ChartData";
import { getStartDate } from "@/utils/getStartDate";
import { processRatings } from "@/utils/processRating";
import { PipelineStage } from "mongoose";

export interface MatchParams {
  playerId: number;
  filter: string;
}

export async function fetchMatchRatings(
  params: MatchParams
): Promise<CombinedChartData> {
  const { playerId, filter } = params;

  await getMongoClient();

  const today = new Date();
  const startDateLimit = getStartDate(filter);
  // Define match conditions for 1v1 and 2v2/3v3
  const matchCondition1v1: any = {
    gameMode: "1V1_SUPREMACY",
    [`matchHistoryMap.${playerId}`]: { $exists: true },
    matchDate: {
      $gte: startDateLimit,
      $lte: today.getTime(),
    },
  };

  const matchCondition2v2_3v3: any = {
    gameMode: { $in: ["2V2_SUPREMACY", "3V3_SUPREMACY"] },
    [`matchHistoryMap.${playerId}`]: { $exists: true },
    matchDate: {
      $gte: startDateLimit,
      $lte: today.getTime(),
    },
  };
  // Create aggregation pipeline for 1v1 and 2v2/3v3 matches

  const matchAggregation = (matchCondition: any): PipelineStage[] => {
    const groupByDateFormat =
      filter === "day"
        ? {
            $dateToString: {
              format: "%Y-%m-%d",
              date: { $toDate: "$matchDate" },
            },
          }
        : filter === "week"
          ? {
              $dateToString: {
                format: "%Y-%m-%d",
                date: {
                  $dateFromParts: {
                    isoWeekYear: { $isoWeekYear: { $toDate: "$matchDate" } },
                    isoWeek: { $isoWeek: { $toDate: "$matchDate" } },
                    isoDayOfWeek: 1,
                  },
                },
              },
            }
          : {
              $dateToString: {
                format: "%Y-%m",
                date: { $toDate: "$matchDate" },
              },
            };

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
        $group: {
          _id: groupByDateFormat,
          averageRating: { $avg: "$matchHistoryEntries.newrating" },
          matchDate: {
            $first: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: { $toDate: "$matchDate" },
              },
            },
          },
        },
      },
      {
        $sort: {
          _id: 1,
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
