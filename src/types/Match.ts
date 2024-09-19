import { MatchHistoryMember, TeamResult } from "./MatchHistory";

export interface Match {
  gameMode: string;
  matchType: string;
  matchId: number;
  mapData: {
    name: string;
    imagePath: string;
    isWater: boolean;
  };
  matchDate: number;
  matchDuration: number;
  teams: TeamResult[];
  matchHistoryMap: Record<string, MatchHistoryMember[]>;
  ratingChange?: number;
}
