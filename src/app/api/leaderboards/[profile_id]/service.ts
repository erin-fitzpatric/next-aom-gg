import { LeaderboardTypeNames } from "@/types/LeaderBoard";
import { ILeaderboardPlayer } from "@/types/LeaderboardPlayer";

export type PlayerStatsByLeaderboard = Map<string, ILeaderboardPlayer>;

export function mapLeaderboardStats(
  playerStats: ILeaderboardPlayer[]
): PlayerStatsByLeaderboard {
  const leaderboardMap = new Map<string, ILeaderboardPlayer>();
  playerStats.forEach((leaderboard) => {
    leaderboardMap.set(
      LeaderboardTypeNames[Number(leaderboard.leaderboard_id)],
      leaderboard
    );
  });
  return leaderboardMap;
}
