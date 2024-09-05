import { MatchModel } from "@/db/mongo/model/MatchModel";
import getMongoClient from "@/db/mongo/mongo-client";

export async function getCivWinRates() {
  await getMongoClient();

  const aggregate = [
    {
      $match: {
        gameMode: "1V1_SUPREMACY",
      },
    },
    {
      $unwind: "$teams",
    },
    {
      $unwind: "$teams.results",
    },
    {
      $lookup: {
        from: "leaderboardplayers",
        localField: "teams.results.profile_id",
        foreignField: "profile_id",
        as: "leaderboardplayers",
      },
    },
    // {
    //   $unwind: "$leaderboardplayers",
    // },
    // {
    //   $match: {
    //     "leaderboardplayers.rating": { $gt: 1500 },
    //   },
    // },
    // {
    //   $group: {
    //     _id: "$teams.results.civilization_id",
    //     totalResults: { $sum: 1 },
    //     totalWins: {
    //       $sum: {
    //         $cond: [{ $eq: ["$teams.results.resulttype", 1] }, 1, 0],
    //       },
    //     },
    //   },
    // },
    // {
    //   $addFields: {
    //     winRate: {
    //       $cond: [
    //         { $eq: ["$totalResults", 0] },
    //         0,
    //         { $multiply: [{ $divide: ["$totalWins", "$totalResults"] }, 100] },
    //       ],
    //     },
    //   },
    // },
    // {
    //   $project: {
    //     _id: 0,
    //     civilization_id: "$_id",
    //     totalResults: 1,
    //     totalWins: 1,
    //     winRate: 1,
    //   },
    // },
  ];

  try {
    const civWinRates = await MatchModel.aggregate(aggregate);
    return civWinRates;
  } catch (error: any) {
    throw new Error("Error fetching civ win rates", error);
  }
}
