import { Errors } from "@/utils/errors";
import {
  fetchMatchHistory,
  FetchMatchHistoryResponse,
  mapMatchHistoryData,
} from "./service";
import { MatchHistory } from "@/types/MatchHistory";
import { getCivWinRates } from "./civWinRates";

export const GET = async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Retrieve the playerId from the query parameters
    const playerId = searchParams.get("playerId");
    if (!playerId) {
      return new Response(JSON.stringify({ error: "playerId is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data: FetchMatchHistoryResponse = await fetchMatchHistory(playerId);
    const mappedMatchHistoryData: MatchHistory = mapMatchHistoryData({
      matchHistoryStats: data.matchHistoryStats,
      profiles: data.profiles,
      playerId,
    });
    return new Response(JSON.stringify(mappedMatchHistoryData), {
      headers: { "Content-Type": "application/json" },
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
