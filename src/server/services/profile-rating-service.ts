"use server";

import { MatchModel } from "@/db/mongo/model/MatchModel";
import getMongoClient from "@/db/mongo/mongo-client";
import { CombinedChartData } from "@/types/ChartData";
import { processRatings } from "@/utils/processRating";
import { PipelineStage } from "mongoose";

export interface MatchParams {
  playerId: number;
}

export async function fetchMatchRatings(
  params: MatchParams
): Promise<CombinedChartData> {
  const { playerId } = params;

  await getMongoClient();

  const today = new Date();

  // Define start dates for day, week, and month
  const startDateDay = new Date(today);
  startDateDay.setDate(today.getDate() - 30); // 30 days ago

  const startDateWeek = new Date(today);
  startDateWeek.setDate(today.getDate() - 60); // 7-8 weeks ago

  const startDateMonth = new Date(today);
  startDateMonth.setMonth(today.getMonth() - 4); // 3-4 months ago

  // Define match conditions for solo and team matches (same for all time ranges)
  const matchCondition_Solo: any = {
    gameMode: "1V1_SUPREMACY",
    [`matchHistoryMap.${playerId}`]: { $exists: true },
    matchDate: { $lte: today.getTime() }, // Data before today
  };

  const matchCondition_Team: any = {
    gameMode: { $in: ["2V2_SUPREMACY", "3V3_SUPREMACY", "4V4_SUPREMACY"] },
    [`matchHistoryMap.${playerId}`]: { $exists: true },
    matchDate: { $lte: today.getTime() },
  };

  // Aggregation function that groups data by different time formats (day, week, month)
  const matchAggregation = (
    matchCondition: any,
    startDate: number,
    format: string,
    weekFormat: boolean = false
  ): PipelineStage[] => {
    const groupByDate = weekFormat
      ? {
          $dateFromParts: {
            isoWeekYear: { $isoWeekYear: { $toDate: "$matchDate" } },
            isoWeek: { $isoWeek: { $toDate: "$matchDate" } },
            isoDayOfWeek: 1, // Start from Monday
          },
        }
      : {
          $dateToString: {
            format, // Date format depends on whether it's day or month
            date: { $toDate: "$matchDate" },
          },
        };

    return [
      {
        $match: {
          ...matchCondition,
          matchDate: { $gte: startDate }, // Filter by start date (day/week/month)
        },
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
          _id: groupByDate, // Group by day, week, or month
          averageRating: { $avg: "$matchHistoryEntries.newrating" },
          matchDate: {
            $first: groupByDate, // Use the formatted date as matchDate
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

  // Aggregation pipelines for day, week, and month data
  const dayPipeline = matchAggregation(
    matchCondition_Solo,
    startDateDay.getTime(),
    "%Y-%m-%d"
  );
  const weekPipeline = matchAggregation(
    matchCondition_Solo,
    startDateWeek.getTime(),
    "%Y-%m-%d", // Use "%Y-%m-%d" but group by ISO week manually
    true // Enable week format using ISO week
  );
  const monthPipeline = matchAggregation(
    matchCondition_Solo,
    startDateMonth.getTime(),
    "%Y-%m"
  );

  // Fetch data for all three pipelines (solo and team matches)
  const [resultDaySolo, resultWeekSolo, resultMonthSolo] = await Promise.all([
    MatchModel.aggregate(dayPipeline),
    MatchModel.aggregate(weekPipeline),
    MatchModel.aggregate(monthPipeline),
  ]);

  // Process solo match data
  const chartData_Solo = {
    day: processRatings(resultDaySolo),
    week: processRatings(resultWeekSolo),
    month: processRatings(resultMonthSolo),
  };

  // Repeat the same logic for team matches
  const [resultDayTeam, resultWeekTeam, resultMonthTeam] = await Promise.all([
    MatchModel.aggregate(
      matchAggregation(matchCondition_Team, startDateDay.getTime(), "%Y-%m-%d")
    ),
    MatchModel.aggregate(
      matchAggregation(
        matchCondition_Team,
        startDateWeek.getTime(),
        "%Y-%m-%d",
        true
      )
    ),
    MatchModel.aggregate(
      matchAggregation(matchCondition_Team, startDateMonth.getTime(), "%Y-%m")
    ),
  ]);

  // Process team match data
  const chartData_Team = {
    day: processRatings(resultDayTeam),
    week: processRatings(resultWeekTeam),
    month: processRatings(resultMonthTeam),
  };
  // Return combined data for both solo and team matches
  return {
    solo: chartData_Solo,
    team: chartData_Team,
  };
}
