import { getPlayerStats, IGetPlayerStats } from "../service";

export const GET = async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const params: IGetPlayerStats = {
      playerId: parseInt(searchParams.get("playerId") as string),
    };

    const leaderboardData = await getPlayerStats(params);
    if (!leaderboardData) {
      return Response.json({ error: "Player not found" }, { status: 404 });
    }
    return Response.json(leaderboardData);
  } catch (error: any) {
    return Response.json(
      { error: "Error fetching myth data" },
      { status: 500 }
    );
  }
};
