import { CombinedChartData } from "@/types/ChartData";
import {
  fetchMatchRatings,
  MatchParams,
} from "../services/profile-rating-service";

export async function getMatchRatings({
  playerId,
}: MatchParams): Promise<CombinedChartData> {
  try {
    const ratings = await fetchMatchRatings({
      playerId,
    });
    return ratings;
  } catch (error: any) {
    console.error("Error fetching matches:", error);
    throw new Error(error.message);
  }
}
