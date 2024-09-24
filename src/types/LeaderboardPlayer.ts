export interface ILeaderboardPlayer {
  statgroup_id: { type: Number; index: true };
  leaderboard_id: { type: Number; index: true };
  wins: Number;
  losses: Number;
  streak: Number;
  disputes: Number;
  drops: Number;
  rank: Number;
  ranktotal: Number;
  ranklevel: Number;
  rating: Number;
  regionrank: Number;
  regionranktotal: Number;
  lastmatchdate: Number;
  highestrank: Number;
  highestranklevel: Number;
  highestrating: Number;
  personal_statgroup_id: Number;
  profile_id: Number;
  level: Number;
  name: { type: String; index: true };
  profileUrl: String;
  country: String;
  winPercent: Number;
  totalGames: Number;
  isLive: Boolean;
}
