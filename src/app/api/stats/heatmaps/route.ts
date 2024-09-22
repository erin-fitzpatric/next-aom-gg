import { fetchHeatMaps } from "./service";

// Fetch all heatmaps
export const GET = async function GET(req: Request) {
  try {
    // fetch heat maps
    const heatMaps = await fetchHeatMaps();

    return new Response(JSON.stringify(heatMaps), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=86400",
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: "Error fetching matchup stats" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
