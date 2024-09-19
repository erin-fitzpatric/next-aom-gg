import { Errors } from "@/utils/errors";
import { fetchMongoMatchHistory, mapMatchHistoryData } from "./service";
import { Match } from "@/types/Match";
import { sortTeams } from "./matchHelpers";

export const GET = async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Retrieve the playerId from the query parameters
    const playerId = Number(searchParams.get("playerId"));
    const skip = Number(searchParams.get("skip")) || 0;
    const limit = Number(searchParams.get("limit")) || 10;

    if (!playerId) {
      return new Response(JSON.stringify({ error: "playerId is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const matchData: Match[] = await fetchMongoMatchHistory(playerId, {
      skip,
      limit,
    });
    const mappedMatchData = mapMatchHistoryData(matchData, playerId);

    return new Response(JSON.stringify(mappedMatchData), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=180, stale-while-revalidate=60",
      },
    });
  } catch (error: any) {
    if (error.message === Errors.PLAYER_NOT_FOUND) {
      return new Response(JSON.stringify({ error: "Player not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(
      JSON.stringify({ error: "Error fetching profile data" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
