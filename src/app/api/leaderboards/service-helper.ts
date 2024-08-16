import { Player } from "@/types/Player";

// Map the leaderboard data - this is all placeholder data, will need to see what the actual data looks like
// For aoe2 data, there are two arrays in the response - statGroups and leaderboardStats that need to be combined
export function mapLeaderboardData(data: any): Player[] {
  const leaderboardStatsMap = new Map();
  data.leaderboardStats.forEach((stat: any) =>
    leaderboardStatsMap.set(stat.statgroup_id, stat)
  );
  const mappedLeaderboardData = data.statGroups.map((statGroup: any) => {
    const playerStats = leaderboardStatsMap.get(statGroup.id);
    return {
      ...playerStats,
      ...statGroup,
    };
  });

  const players: Player[] = mappedLeaderboardData.map((player: any) => {
    const totalGames = player.wins + player.losses;
    const winPercent = player.wins / totalGames;
    return {
      id: player.id,
      name: player.members[0].alias,
      rank: player.rank,
      winPercent,
      totalGames,
    };
  });

  return players;
}
