import {
  MatchHistoryReportResult,
  TeamResult,
  MatchHistoryMember,
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

export function mapToTeams(
  results: MatchHistoryReportResult[],
  profile_id: number
): TeamResult[] {
  const teamMap = new Map<number, MatchHistoryReportResult[]>();

  // Build the teamMap
  results.forEach((result) => {
    const { teamid } = result;
    if (!teamMap.has(teamid)) {
      teamMap.set(teamid, []);
    }
    teamMap.get(teamid)?.push(result);
  });

  // Identify the team that contains the given profile_id
  let specialTeamId: number | null = null;
  for (const [teamid, teamResults] of teamMap.entries() as any) {
    if (teamResults.some((result: any) => result.profile_id === profile_id)) {
      specialTeamId = teamid;
      break;
    }
  }

  // Convert teamMap to an array and sort so that the team with the special profile_id is first
  const teams = Array.from(teamMap.entries()).map(([teamid, results]) => ({
    teamid,
    results,
  }));

  // Sort the teams array to have the special team first if it exists
  teams.sort((a, b) => (a.teamid === specialTeamId ? -1 : 1));

  return teams;
}

interface MatchHistoryMap {
  [profile_id: number]: MatchHistoryMember[];
}

export function createMatchHistoryMap(
  data: MatchHistoryMember[]
): MatchHistoryMap {
  const map: MatchHistoryMap = {};

  data.forEach((member) => {
    if (!map[member.profile_id]) {
      map[member.profile_id] = [];
    }
    map[member.profile_id].push(member);
  });
  return map;
}

export function parseMapName(mapname: string): string {
  const underscoreIndex = mapname.indexOf("_");
  return underscoreIndex !== -1
    ? mapname.substring(underscoreIndex + 1)
    : mapname;
}
