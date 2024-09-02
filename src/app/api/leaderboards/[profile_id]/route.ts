import { getPlayerStats, IGetPlayerStats } from "../service";

export const GET = async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const params: IGetPlayerStats = {
      leaderboardId: parseInt(searchParams.get("leaderboardId") as string),
      playerId: parseInt(searchParams.get("playerId") as string),
    };

    const leaderboardData = await getPlayerStats(params);
    return Response.json(leaderboardData);
  } catch (error: any) {
    return Response.json(
      { error: "Error fetching myth data" },
      { status: 500 }
    );
  }
};
