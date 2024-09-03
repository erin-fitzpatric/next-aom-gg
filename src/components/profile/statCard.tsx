import { ILeaderboardPlayer } from "@/types/LeaderboardPlayer";
import { LeaderboardTypeNames } from "@/types/LeaderBoard";
import { Card, CardContent } from "../ui/card";
import { formatTimeAgoInMs } from "@/utils/dateHelpers";

interface IStatCardProps {
  playerStats: ILeaderboardPlayer;
}

export default function StatCard({ playerStats }: IStatCardProps) {
  // Destructure playerStats for cleaner code
  const {
    leaderboard_id,
    rank,
    rating,
    winPercent,
    wins,
    losses,
    streak,
    lastmatchdate,
  } = playerStats;

  // Format the streak
  const formattedStreak = Number(streak) > 0 ? `+${streak}` : streak;
  const streakClass = Number(streak) > 0 ? "text-primary" : "text-red-500";

  // Convert winPercent to percentage format
  const winPercentFormatted = (Number(winPercent) * 100).toFixed(1);

  return (
    <Card className="w-full shadow-lg">
      <div className="text-xl font-semibold p-2">
        {LeaderboardTypeNames[Number(leaderboard_id)]}
      </div>
      <CardContent>
        <table className="w-full table-auto border-separate border-spacing-0">
          <thead className="text-gold text-left text-lg font-semibold">
            <tr>
              <th className="px-4 w-1/5">Rank</th>
              <th className="px-4 w-1/5">Elo</th>
              <th className="px-4 w-1/5">Win %</th>
              <th className="px-4 w-1/5 sm:table-cell hidden">
                Current Streak
              </th>
              <th className="px-4 w-1/5 sm:table-cell hidden">
                Last Match
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2">#{String(rank)}</td>
              <td className="px-4 py-2">{String(rating)}</td>
              <td className="px-4 py-2 flex items-center space-x-2">
                <div>{winPercentFormatted}%</div>
                <div className="text-primary">W {String(wins)}</div>
                <div className="text-red-500">L {String(losses)}</div>
              </td>
              <td className={`px-4 py-2 ${streakClass} sm:table-cell hidden`}>
                {String(formattedStreak)}
              </td>
              <td className="px-4 py-2 sm:table-cell hidden">
                {formatTimeAgoInMs(Number(lastmatchdate))}
              </td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
