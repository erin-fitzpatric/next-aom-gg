import {
  MappedMatchHistoryData,
  MatchHistory,
  MatchHistoryStat,
  Profile,
} from "@/types/MatchHistory";
import { Errors } from "@/utils/errors";
import {
  createMatchHistoryMap,
  groupAndReorderTeams,
  parseMapName,
} from "./matchHelpers";
import { randomMapNameToData } from "@/types/RandomMap";
import { getGameModeByMatchTypeId } from "@/types/MatchTypes";

export type FetchMatchHistoryResponse = {
  matchHistoryStats: MatchHistoryStat[];
  profiles: Profile[];
};

export async function fetchMatchHistory(
  playerId: string
): Promise<FetchMatchHistoryResponse> {
  const baseUrl =
    "https://athens-live-api.worldsedgelink.com/community/leaderboard/getRecentMatchHistory";
  const profileIds = JSON.stringify([playerId]);
  const url = `${baseUrl}?title=athens&profile_ids=${encodeURIComponent(
    profileIds
  )}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch profile data");
  }

  const data = await response.json();
  if (data.result.code !== 0) {
    // No match found for the playerId
    throw new Error(Errors.PLAYER_NOT_FOUND);
  }
  return {
    matchHistoryStats: data.matchHistoryStats,
    profiles: data.profiles,
  };
}

export function mapMatchHistoryData({
  matchHistoryStats,
  profiles,
  playerId,
}: {
  matchHistoryStats: MatchHistoryStat[];
  profiles: Profile[];
  playerId: string;
}): MatchHistory {
  // Sort the match history stats by completion time
  const sortedMatchHistoryStats = matchHistoryStats.sort(
    (a: MatchHistoryStat, b: MatchHistoryStat) =>
      b.completiontime - a.completiontime
  );

  const profileMap = getProfileMap(profiles);
  const playerName = getPlayerName(profileMap, playerId);
  const mappedMatchHistoryData: MappedMatchHistoryData[] =
    sortedMatchHistoryStats.map((match, index) => {
      const {
        mapname,
        startgametime,
        completiontime,
        matchhistoryreportresults,
        matchhistorymember,
      } = match;

      // map the match data
      const parsedMapName = parseMapName(mapname);
      const mapData = randomMapNameToData(parsedMapName);
      const matchDuration = completiontime - startgametime;
      const matchDate = startgametime * 1000;
      const teams = groupAndReorderTeams(
        matchhistoryreportresults,
        profileMap,
        playerId
      );
      const matchHistoryMap = createMatchHistoryMap(matchhistorymember);
      const ratingChange =
        matchHistoryMap[playerId][0].newrating -
        matchHistoryMap[playerId][0].oldrating;
      const gameMode =
        getGameModeByMatchTypeId(match.matchtype_id) || "Unknown Game Mode";
      const matchType = match.description;

      return {
        gameMode: gameMode,
        matchType: matchType,
        matchId: match.id,
        mapData,
        matchDate,
        matchDuration,
        teams,
        matchHistoryMap,
        ratingChange,
      };
    });
  return { mappedMatchHistoryData, playerName };
}

export function getPlayerName(
  profileMap: Record<string, Profile>,
  playerId: string
): string {
  const playerName = profileMap[playerId].alias;
  return playerName;
}

export function getProfileMap(profiles: Profile[]): Record<string, Profile> {
  const profileMap = profiles.reduce((acc, profile) => {
    acc[profile.profile_id] = profile;
    return acc;
  }, {} as Record<string, Profile>);
  return profileMap;
}
