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

    const baseUrl =
      "https://athens-live-api.worldsedgelink.com/community/leaderboard/getRecentMatchHistory";
    const profileIds = JSON.stringify([playerId]);
    const url = `${baseUrl}?title=athens&profile_ids=${encodeURIComponent(
      profileIds
    )}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch profile data");
    }

    const data = await response.json();

    if (data && data.matchHistoryStats) {
      // sort the match history stats by timestamp becuase its in random fucking order
      const sortedMatchHistoryStats = data.matchHistoryStats.sort(
        (a: any, b: any) => b.completiontime - a.completiontime
      );
      data.matchHistoryStats = sortedMatchHistoryStats;
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify([]), {
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: "Error fetching profile data" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
