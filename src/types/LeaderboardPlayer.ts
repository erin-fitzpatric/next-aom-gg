export interface ILeaderboardPlayer {
  id: {type : Number, index: true},
  name: { type: String, index: true },
  profileUrl: String,
  country: String,
  rank: Number,
  wins: Number,
  losses: Number,
  winPercent: Number,
  totalGames: Number,
}
