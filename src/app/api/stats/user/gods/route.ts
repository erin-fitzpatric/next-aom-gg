import { getUserGodStats, IFetchUserGodStatsParams } from "./service";

export const GET = async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const params: IFetchUserGodStatsParams = {
      playerId: parseInt(searchParams.get("playerId") || "0", 10),
      patchDescription: searchParams.get("patchDescription") || undefined,
      civilization: searchParams.get("civilization")
        ? parseInt(searchParams.get("civilization")!, 10)
        : undefined,
      gameMode: searchParams.get("gameMode") || undefined,
    };
    const userGodStats = await getUserGodStats(params);
    return new Response(JSON.stringify(userGodStats));
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: "Error fetching user god stats" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
