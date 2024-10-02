import { fetchMatchRatings } from "../services/profile-rating-service";

export async function getMatchRatings(req: Request) {
  const { searchParams } = new URL(req.url);
  const playerId = parseInt(searchParams.get("playerId") || "", 10);
  const startDate = parseInt(searchParams.get("start_date") || "", 10);
  const endDate = parseInt(searchParams.get("end_date") || "", 10);

  try {
    const ratings = await fetchMatchRatings({
      playerId,
      startDate,
      endDate,
    });

    return Response.json(ratings, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error fetching matches:", error);
    return (
      Response.json({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
