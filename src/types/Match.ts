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
  teams: Array<{
    teamid: number;
    results: Array<{
      civilization_id: number;
      matchhistory_id: number;
      matchstartdate: number;
      profile_id: number;
      race_id: number;
      resulttype: number;
      teamid: number;
      xpgained: number;
      postgameStats: {
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
      playerName: string;
    }>;
  }>;
  matchHistoryMap: Map<
    number,
    Array<{
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
    }>
  >;
}
