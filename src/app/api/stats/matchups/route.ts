import { Errors } from "@/utils/errors";
import { MatchHistory } from "@/types/MatchHistory";

export const GET = async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Retrieve the civId and eloBin from the query parameters
    const civId = searchParams.get("civId");
    const eloBin = searchParams.get("eloBin");
    if (!civId) {
      return new Response(JSON.stringify({ error: "civId is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (!eloBin) {
      return new Response(JSON.stringify({ error: "eloBin is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(mappedMatchHistoryData), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: "Error fetching matchup stats" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
