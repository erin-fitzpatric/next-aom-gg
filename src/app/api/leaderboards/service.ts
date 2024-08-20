import { LeaderboardPlayerModel } from "@/db/mongo/model/LeaderboardPlayerModel";
import getMongoClient from "@/db/mongo/mongo-client";
import { ILeaderboardPlayer } from "@/types/LeaderboardPlayer";
import { MongoSort } from "@/types/MongoSort";

export interface IGetMythLeaderboard {
  skip: number;
  limit: number;
  sort: MongoSort;
  searchQuery: string;
}

export interface IGetMythLeaderboardResponse {
  leaderboardPlayers: ILeaderboardPlayer[];
  totalRecords: number;
}

export async function getMythLeaderboard(
  req: IGetMythLeaderboard
): Promise<IGetMythLeaderboardResponse> {
  const { skip, limit, sort, searchQuery } = req;
  await getMongoClient();
  try {
    const result: ILeaderboardPlayer[] = await LeaderboardPlayerModel.find({
      name: { $regex: searchQuery, $options: "i" },
    })
      .lean()
      .sort(sort)
      .skip(skip)
      .limit(limit);
    return {
      leaderboardPlayers: result,
      totalRecords: await LeaderboardPlayerModel.countDocuments({
        name: { $regex: searchQuery, $options: "i" },
      }),
    };
  } catch (error: any) {
    throw new Error("Error fetching myth leaderboard", error);
  }
}
