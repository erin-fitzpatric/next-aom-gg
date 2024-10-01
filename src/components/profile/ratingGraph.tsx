import { fetchMatchRatings } from "@/server/services/profile-rating-service";

interface MatchRatingsProps {
  profile_id: number;
  game_mode: string;
  startDate: number;
  endDate: number;
}

export default async function MatchRatings({
  profile_id,
  game_mode,
  startDate,
  endDate,
}: MatchRatingsProps) {
  try {
    const ratings = await fetchMatchRatings({
      profile_id,
      game_mode,
      startDate,
      endDate,
    });

    return (
      <div>
        <h1>Profile Ratings</h1>
        <pre>{JSON.stringify(ratings, null, 2)}</pre>
      </div>
    );
  } catch (error: any) {
    console.error("Error fetching match ratings:", error);
    return <div>Error: {error.message}</div>;
  }
}
