import { CombinedChartData } from "@/types/ChartData";
import {
  fetchMatchRatings,
  MatchParams,
} from "../services/profile-rating-service";

export async function getMatchRatings({
  playerId,
  startDate,
  endDate,
}: MatchParams): Promise<CombinedChartData> {
  try {
    const ratings = await fetchMatchRatings({
      playerId,
      startDate,
      endDate,
    });

    return ratings;
  } catch (error: any) {
    console.error("Error fetching matches:", error);
    throw new Error(error.message);
  }
}
