import { MappedTeam } from "@/app/api/matchHistory/matchHelpers";
import { RandomMapData } from "./RandomMap";

export type MatchHistoryReportResult = {
  matchhistory_id: number;
  profile_id: number;
  resulttype: number;
  teamid: number;
  race_id: number;
  xpgained: number;
  counters: string; // JSON string, should be parsed into an object if needed
  matchstartdate: number;
  civilization_id: number;
};

export type MatchStats = {
  civPlayed_Random: number;
  mapID: number;
  postGameAward_HighestScore: number;
  postGameAward_MostDeaths: number;
  postGameAward_MostImprovements: number;
  postGameAward_MostKills: number;
  postGameAward_MostResources: number;
  postGameAward_MostTitanKills: number;
  postGameAward_largestArmy: number;
  rankedMatch: number;
  score_Economic: number;
  score_Military: number;
  score_Technology: number;
  score_Total: number;
  stat_BuildingsRazed: number;
  stat_UnitsKilled: number;
  stat_UnitsLost: number;
};

export type MatchHistoryMember = {
  matchhistory_id: number;
  profile_id: number;
  race_id: number;
  statgroup_id: number;
  teamid: number;
  wins: number;
  losses: number;
  streak: number;
  arbitration: number;
  outcome: number;
  oldrating: number;
  newrating: number;
  reporttype: number;
  civilization_id: number;
};

export type MatchUrl = {
  profile_id: number;
  url: string;
  size: number;
  datatype: number;
};

export type MatchHistoryStat = {
  id: number;
  creator_profile_id: number;
  mapname: string;
  maxplayers: number;
  matchtype_id: number;
  options: string; // Base64 encoded string
  slotinfo: string; // Base64 encoded string
  description: string;
  startgametime: number;
  completiontime: number;
  observertotal: number;
  matchhistoryreportresults: MatchHistoryReportResult[];
  matchhistoryitems: any[]; // Replace `any` with the appropriate type if known
  matchurls: MatchUrl[];
  matchhistorymember: MatchHistoryMember[];
};

export type Profile = {
  profile_id: number;
  name: string;
  alias: string;
  personal_statgroup_id: number;
  xp: number;
  level: number;
  leaderboardregion_id: number;
  country: string;
};

export type MatchHistoryResponse = {
  result: {
    code: number;
    message: string;
  };
  matchHistoryStats?: MatchHistoryStat[];
  profiles?: Profile[];
};

export type TeamResult = {
  teamid: number;
  results: MappedTeam[];
};

export type MappedMatchHistoryData = {
  matchType: string;
  gameMode: string;
  matchId: number;
  mapData: RandomMapData;
  matchDate: number;
  matchDuration: number;
  teams: TeamResult[];
  matchHistoryMap: MatchHistoryMap;
  ratingChange: number;
};

export type MatchHistory = {
  mappedMatchHistoryData: MappedMatchHistoryData[];
  playerName: string;
};

export interface MatchHistoryMap {
  [profile_id: string]: MatchHistoryMember[];
}
