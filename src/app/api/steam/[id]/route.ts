import { fetchSteamProfile } from "./service";

export const GET = async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const steamId = searchParams.get("id") as string;

    const leaderboardData = await fetchSteamProfile(steamId);
    return Response.json(leaderboardData);
  } catch (error: any) {
    return Response.json(
      { error: "Error fetching steam profile" },
      { status: 500 }
    );
  }
};
