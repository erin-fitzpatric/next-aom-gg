import {
  fetchMatchRatings,
  MatchParams,
} from "../services/profile-rating-service";

export async function getMatchRatings({
  playerId,
  startDate,
  endDate,
}: MatchParams): Promise<{ chartData1v1: any; chartData2v2_3v3: any }> {
  try {
    const ratings = await fetchMatchRatings({
      playerId,
      startDate,
      endDate,
    });

    const { chartData1v1, chartData2v2_3v3 } = ratings;

    return { chartData1v1, chartData2v2_3v3 };
  } catch (error: any) {
    console.error("Error fetching matches:", error);
    throw new Error(error.message);
  }
}
