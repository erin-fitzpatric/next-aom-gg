import { Errors } from "@/utils/errors";
import { fetchMongoMatchHistory, mapMatchHistoryData } from "./service";
import { MatchResults } from "@/types/Match";

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

    const matchData: MatchResults = await fetchMongoMatchHistory(playerId, {
      skip,
      limit,
    });
    const [ data, totalCount ] = [ matchData.data, matchData.totalCount ];
    const mappedMatchData = mapMatchHistoryData(data, playerId);

    return new Response(JSON.stringify({
      matches: mappedMatchData,
      total: totalCount,
    }), {
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
