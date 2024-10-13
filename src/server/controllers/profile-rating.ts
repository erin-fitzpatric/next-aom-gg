import { CombinedChartData } from "@/types/ChartData";
import {
  fetchMatchRatings,
  MatchParams,
} from "../services/profile-rating-service";

export async function getMatchRatings({
  playerId,
  filter,
}: MatchParams): Promise<CombinedChartData> {
  try {
    const ratings = await fetchMatchRatings({
      playerId,
      filter,
    });

    return ratings;
  } catch (error: any) {
    console.error("Error fetching matches:", error);
    throw new Error(error.message);
  }
}
