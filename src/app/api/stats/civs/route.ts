import { fetchCivStats, IFetchCivStatsParams, mapCivStats } from "./service";

function toUTCDate(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}

// Get civ stats across all elo bins on page load, then filter by elo bin for subsequent requests
export const GET = async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const params: IFetchCivStatsParams = {
      eloRange: searchParams?.get("eloRange") || "All",
      startDate: searchParams?.get("startDate")
        ? toUTCDate(new Date(searchParams.get("startDate")!))
        : toUTCDate(new Date("2024-08-27")), // default startDate to 8/27/2024 in UTC
      endDate: searchParams?.get("endDate")
        ? toUTCDate(new Date(searchParams.get("endDate")!))
        : toUTCDate(new Date()), // default endDate to today in UTC
    };

    // fetch civ stats
    const civStats = await fetchCivStats(params);
    const civStatsAggregate = mapCivStats(civStats);

    return new Response(JSON.stringify(civStatsAggregate), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=43200, stale-while-revalidate=43200",
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: "Error fetching matchup stats" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
