import { Match } from "@/types/Match";
import {
  MatchHistoryReportResult,
  TeamResult,
  MatchHistoryMember,
  Profile,
  MatchStats,
  MatchHistoryMap,
} from "@/types/MatchHistory";

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    secs.toString().padStart(2, "0"),
  ].join(":");
};

export type MappedTeam = {
  playerName: string;
  postgameStats: MatchStats;
  civilization_id: number;
  matchhistory_id: number;
  matchstartdate: number;
  profile_id: number;
  race_id: number;
  resulttype: number;
  teamid: number;
  xpgained: number;
};

export function sortTeams(matchData: Match[], playerId: number): Match[] {
  return matchData.map((match) => {
    const sortedTeams = match.teams
      .sort((teamA, teamB) => {
        // Check if either team contains the playerId
        const hasPlayerInTeamA = teamA.results.some(
          (result) => result.profile_id === playerId
        );
        const hasPlayerInTeamB = teamB.results.some(
          (result) => result.profile_id === playerId
        );

        // Place team with playerId first
        if (hasPlayerInTeamA && !hasPlayerInTeamB) {
          return -1;
        }
        if (!hasPlayerInTeamA && hasPlayerInTeamB) {
          return 1;
        }
        return 0;
      })
      .map((team) => {
        // Sort results within each team to ensure playerId is prioritized
        const sortedResults = team.results.sort((a, b) => {
          if (a.profile_id === playerId) {
            return -1;
          }
          if (b.profile_id === playerId) {
            return 1;
          }
          return 0;
        });
        return { ...team, results: sortedResults };
      });

    return { ...match, teams: sortedTeams };
  });
}
