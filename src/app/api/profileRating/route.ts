import { MatchModel } from "@/db/mongo/model/MatchModel";
import getMongoClient from "@/db/mongo/mongo-client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const profile_id = parseInt(searchParams.get("profile_id") || "", 10);
  const game_mode = searchParams.get("game_mode");
  const startDate = parseInt(searchParams.get("start_date") || "", 10);
  const endDate = parseInt(searchParams.get("end_date") || "", 10);

  await getMongoClient();
  // TODO: need to refine date filtering
  try {
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
      return Response.json(result[0].allNewRatings);
    } else {
      throw new Error(`No match found for profile ID: ${profile_id}`);
    }
  } catch (error: any) {
    console.error("Error fetching matches:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
