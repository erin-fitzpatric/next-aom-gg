import { getMythLeaderboard, IGetMythLeaderboard, PlatformType } from "./service";
import { mapLeaderboardData } from "./service-helper";

export const GET = async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const params: IGetMythLeaderboard = {
      platform: searchParams.get("platform") as PlatformType,
      leaderboardId: parseInt(searchParams.get("leaderboardId") as string),
      skip: parseInt(searchParams.get("skip") as string),
      limit: parseInt(searchParams.get("limit") as string),
      sort: parseInt(searchParams.get("sort") as string),
    }

    const leaderboardData = await getMythLeaderboard(params);
    const players = mapLeaderboardData(leaderboardData);
    return Response.json(players);
  } catch (error: any) {
    return Response.json(
      { error: "Error fetching myth data" },
      { status: 500 }
    );
  }
};
