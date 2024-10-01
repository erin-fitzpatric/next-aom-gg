import { fetchMatchRatings } from "../services/profile-rating-service";

export async function getMatchRatings(req: Request) {
  const { searchParams } = new URL(req.url);
  const profile_id = parseInt(searchParams.get("profile_id") || "", 10);
  const game_mode = searchParams.get("game_mode") || "";
  const startDate = parseInt(searchParams.get("start_date") || "", 10);
  const endDate = parseInt(searchParams.get("end_date") || "", 10);

  try {
    const ratings = await fetchMatchRatings({
      profile_id,
      game_mode,
      startDate,
      endDate,
    });

    return new Response(JSON.stringify(ratings), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error fetching matches:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
