export interface Matchup {
  totalResults: number;
  totalWins: number;
}

export interface MatchData {
  matchups: {
    [godName: string]: Matchup;
  };
}

export interface GodStats {
  totalResults: number;
  totalWins: number;
}

export interface MatchupStats {
  [godName: string]: GodStats;
}

