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

export function groupAndReorderTeams(
  results: MatchHistoryReportResult[],
  profiles: Record<string, Profile>,
  profile_id: string
): TeamResult[] {
  // Step 1: Group the results by teamid
  const teamsMap: { [key: number]: MappedTeam[] } = results.reduce(
    (acc, result) => {
      const { teamid } = result;
      if (!acc[teamid]) {
        acc[teamid] = [];
      }
      acc[teamid].push({
        civilization_id: result.civilization_id,
        matchhistory_id: result.matchhistory_id,
        matchstartdate: result.matchstartdate,
        profile_id: result.profile_id,
        race_id: result.race_id,
        resulttype: result.resulttype,
        teamid: result.teamid,
        xpgained: result.xpgained,
        postgameStats: JSON.parse(result.counters) as MatchStats,
        playerName: profiles[result.profile_id].alias,
      });
      return acc;
    },
    {} as { [key: number]: MappedTeam[] }
  );

  // Step 2: Convert the teamsMap object to an array of TeamResult
  let teamsArray: TeamResult[] = Object.entries(teamsMap).map(
    ([teamid, results]) => ({
      teamid: Number(teamid),
      results,
    })
  );

  // Step 3: Find the index of the team containing the target profile_id
  const targetIndex = teamsArray.findIndex((team) =>
    team.results.some((player) => player.profile_id === Number(profile_id))
  );

  // Step 4: If the team with the target profile_id is found, move it to the front
  if (targetIndex > -1) {
    const [targetTeam] = teamsArray.splice(targetIndex, 1);
    teamsArray.unshift(targetTeam);
  }

  return teamsArray;
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
