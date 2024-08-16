export enum PlatformType {
  PC_STEAM = "PC_STEAM",
  XBOX = "XBOX",
}

export interface IGetMythLeaderboard {
  platform: PlatformType;
  leaderboardId: number;
  skip?: number;
  limit?: number;
  sort?: number;
}

export async function getMythLeaderboard(
  req: IGetMythLeaderboard
): Promise<any> {
  try {
    const { skip = 1, limit = 200, sort = 1, platform, leaderboardId } = req;
    const BASE_URL = "https://aoe-api.worldsedgelink.com/"; // TODO - change to the actual myth baseUrl
    const route = "/community/leaderboard/getLeaderBoard2"; // TODO - change to the actual leaderboard route
    const params = {
      leaderboard_id: leaderboardId.toString(),
      platform: platform,
      title: "age2", // TODO - change to whatever the myth title is
      sortBy: sort.toString(),
      start: skip.toString(),
      count: limit.toString(),
    };
    const url = new URL(route, BASE_URL);
    url.search = new URLSearchParams(params).toString();
    const response = await fetch(url.toString());

    return response.json();
  } catch (error: any) {
    console.error("Error fetching myth data", error);
    throw new Error("Error fetching myth data", error);
  }
}
