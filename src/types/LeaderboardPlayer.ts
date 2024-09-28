export interface ILeaderboardPlayer {
  statgroup_id: number;
  leaderboard_id: number;
  wins: number;
  losses: number;
  streak: number;
  disputes: number;
  drops: number;
  rank: number;
  ranktotal: number;
  ranklevel: number;
  rating: number;
  regionrank: number;
  regionranktotal: number;
  lastmatchdate: number;
  highestrank: number;
  highestranklevel: number;
  highestrating: number;
  personal_statgroup_id: number;
  profile_id: number;
  level: number;
  name: { type: String; index: true };
  profileUrl: String;
  country: String;
  winPercent: number;
  totalGames: number;
}
