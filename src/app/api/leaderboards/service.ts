import { LeaderboardPlayerModel } from "@/db/mongo/model/LeaderboardPlayerModel";
import getMongoClient from "@/db/mongo/mongo-client";
import { ILeaderboardPlayer } from "@/types/LeaderboardPlayer";
import { MongoSort } from "@/types/MongoSort";

export interface IGetMythLeaderboard {
  skip: number;
  limit: number;
  sort: MongoSort;
  searchQuery: string;
  leaderboardId: string;
}

export interface IGetMythLeaderboardResponse {
  leaderboardPlayers: ILeaderboardPlayer[];
  totalRecords: number;
}

// worldsedgelink.com - not working yet
export async function getMythLeaderboard(
  req: IGetMythLeaderboard
): Promise<IGetMythLeaderboardResponse> {
  const { skip, limit, sort, searchQuery } = req;
  await getMongoClient();
  try {
    const result: ILeaderboardPlayer[] = await LeaderboardPlayerModel.find({
      name: { $regex: searchQuery, $options: "i" },
      leaderboard_id: req.leaderboardId,
    })
      .lean()
      .sort(sort)
      .skip(skip)
      .limit(limit);
    return {
      leaderboardPlayers: result,
      totalRecords: await LeaderboardPlayerModel.countDocuments({
        name: { $regex: searchQuery, $options: "i" },
        leaderboard_id: req.leaderboardId,
      }),
    };
  } catch (error: any) {
    throw new Error("Error fetching myth leaderboard", error);
  }
}

export interface IGetPlayerStats {
  playerId: number;
}

export async function getPlayerStats({
  playerId
}: IGetPlayerStats): Promise<ILeaderboardPlayer[] | null> {
  await getMongoClient();
  try {
    const result = await LeaderboardPlayerModel.find({
      profile_id: playerId
    }).lean();
    return result;
  } catch (error: any) {
    throw new Error("Error fetching player stats", error);
  }
}

export type AoeApiPlayer = {
  gameId: string;
  userId: string | null;
  rlUserId: number;
  userName: string;
  avatarUrl: string;
  playerNumber: number | null;
  elo: number;
  eloRating: number;
  eloHighest: number;
  rank: number;
  rankTotal: number;
  region: string;
  wins: number;
  winPercent: number;
  losses: number;
  winStreak: number;
  totalGames: number;
  rankLevel: string;
  rankIcon: string;
  leaderboardKey: string;
};

export interface OfficialApiResponse {
  leaderboardPlayers: AoeApiPlayer[];
  totalRecords: number;
  lastUpdated: string;
}

// ageofempires.com
/**
 * @deprecated This function is deprecated and will be removed in future releases.
 * Use `getMythLeaderboard` instead.
 */

export async function getAgeOfEmpiresMythLeaderboard(
  req: IGetMythLeaderboard
): Promise<OfficialApiResponse> {
  const { skip, limit, sort, searchQuery } = req;

  const requestBody = {
    region: 7,
    matchType: 1,
    consoleMatchType: 15,
    searchPlayer: searchQuery || "",
    page: Math.floor(skip / limit) + 1,
    count: 200, // This is commented out; the API might not respect it
    sortColumn: sort ? Object.keys(sort)[0] : "rank",
    sortDirection: "ASC",
  };

  try {
    const response = await fetch(
      "https://api.ageofempires.com/api/agemyth/Leaderboard",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    let leaderboardPlayers: AoeApiPlayer[] = [];

    // no results found
    if (response.status === 204) {
      return {
        leaderboardPlayers,
        totalRecords: 0,
        lastUpdated: new Date().toISOString(),
      };
    }

    // map found results
    const data = await response.json();
    leaderboardPlayers = data.items.slice(0, limit); // Slicing the array to respect the limit since the API doesn't lol

    return {
      leaderboardPlayers,
      totalRecords: data.count,
      lastUpdated: data.lastUpdated,
    };
  } catch (error: any) {
    throw new Error("Error fetching Age of Empires Mythology leaderboard");
  }
}
