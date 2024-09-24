import { BuildModel } from "@/db/mongo/model/BuildNumber";
import { MatchModel } from "@/db/mongo/model/MatchModel";
import getMongoClient from "@/db/mongo/mongo-client";

export interface IFetchUserGodStatsParams {
  playerId: number;
  patchDescription?: string;
  civilization?: number;
  gameMode?: string;
}

async function getPatchDates(patchDescription: string) {
  await getMongoClient();
  const builds = await BuildModel.find().sort({ releaseDate: 1 });
  const patchIndex = builds.findIndex(
    (build) => build.description === patchDescription
  );

  if (patchIndex === -1) {
    throw new Error("Patch description not found");
  }

  const startDate = builds[patchIndex].releaseDate;
  const endDate =
    patchIndex < builds.length - 1
      ? builds[patchIndex + 1].releaseDate
      : new Date();

  return { startDate, endDate };
}

export async function getUserGodStats(params: IFetchUserGodStatsParams) {
  await getMongoClient();
  const { playerId, patchDescription, civilization, gameMode } = params;
  let matchQuery: any = {
    "teams.results.profile_id": playerId,
  };

  if (patchDescription) {
    const { startDate, endDate } = await getPatchDates(patchDescription);
    matchQuery.matchDate = {
      $gte: startDate.getTime(),
      $lt: endDate.getTime(),
    };
  }

  if (civilization) {
    matchQuery["teams.results"] = {
      $elemMatch: {
        profile_id: playerId,
        civilization_id: civilization,
      },
    };
  }

  if (gameMode) {
    matchQuery.gameMode = gameMode;
  }

  const matches = await MatchModel.find(matchQuery);

  const godStatsMap = new Map<
    string,
    {
      civilization_id: number;
      race_id: number;
      wins: number;
      losses: number;
      number_of_games: number;
    }
  >();

  for (const match of matches) {
    const gameMode = match.gameMode;
    for (const team of match.teams) {
      for (const result of team.results) {
        if (result.profile_id === playerId) {
          const { civilization_id, race_id, resulttype } = result;
          const key = `${gameMode}-${civilization_id}`;
          if (!godStatsMap.has(key)) {
            godStatsMap.set(key, {
              civilization_id,
              race_id,
              wins: 0,
              losses: 0,
              number_of_games: 0,
            });
          }
          const godStats = godStatsMap.get(key)!;
          godStats.number_of_games += 1;
          if (resulttype === 1) {
            godStats.wins += 1;
          } else {
            godStats.losses += 1;
          }
        }
      }
    }
  }

  const totalGames = Array.from(godStatsMap.values()).reduce(
    (acc, stat) => acc + stat.number_of_games,
    0
  );

  const combinedGodStats = new Map<
    number,
    {
      civilization_id: number;
      race_id: number;
      total_wins: number;
      total_games: number;
    }
  >();

  // Combine the stats across game modes
  Array.from(godStatsMap.entries()).forEach(([_, stat]) => {
    const { civilization_id, race_id, wins, number_of_games } = stat;

    if (!combinedGodStats.has(civilization_id)) {
      combinedGodStats.set(civilization_id, {
        civilization_id,
        race_id,
        total_wins: 0,
        total_games: 0,
      });
    }

    const combinedStat = combinedGodStats.get(civilization_id)!;
    combinedStat.total_wins += wins;
    combinedStat.total_games += number_of_games;
  });

  const godStatsArray = Array.from(combinedGodStats.values()).map((stat) => {
    return {
      civilization_id: stat.civilization_id,
      race_id: stat.race_id,
      win_rate: stat.total_wins / stat.total_games,
      play_rate: stat.total_games / totalGames,
      number_of_games: stat.total_games,
    };
  });

  return godStatsArray;
}
