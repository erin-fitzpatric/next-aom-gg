import RatingLineChart from "@/components/profile/ratingGraph";
import { fetchMatchRatings } from "@/server/services/profile-rating-service";

interface ChartData {
  date: string;
  rating: number;
}

const ProfilePage = async ({ profileId }: { profileId: string }) => {
  const profile_id = 1073796204;
  const game_mode = "1V1_SUPREMACY";
  const startDate = 0;
  const endDate = 0;

  const chartData: ChartData[] = await fetchMatchRatings({
    profile_id,
    game_mode,
    startDate,
    endDate,
  });

  return (
    <div>
      <RatingLineChart data={chartData} />
    </div>
  );
};

export default ProfilePage;
