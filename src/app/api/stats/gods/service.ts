import {
  IStatsCivs,
  StatsCivsModel,
} from "@/db/mongo/model/stats/StatsCivsModel";
import getMongoClient from "@/db/mongo/mongo-client";
import { ALL_ELO_RANGES } from "@/utils/consts";

export interface IFetchCivStatsParams {
  eloRange: string;
  startDate: Date;
  endDate: Date;
}

export async function fetchCivStats(
  params: IFetchCivStatsParams
): Promise<IStatsCivs[]> {
  const { eloRange, startDate, endDate } = params;
  let lowerElo = 0;
  let higherElo = 5000;
  if (eloRange !== ALL_ELO_RANGES) {
    [lowerElo, higherElo] = eloRange.split("-").map(Number);
  }

  await getMongoClient();

  const batchSize = 200; // Adjust as needed
  const count = await StatsCivsModel.countDocuments({
    matchDay: { $gte: startDate, $lte: endDate },
    "metaField.lower_elo": { $gte: lowerElo },
    "metaField.upper_elo": { $lte: higherElo },
  });

  const numBatches = Math.ceil(count / batchSize);
  const batchPromises: Promise<IStatsCivs[]>[] = [];

  try {
    // Create all batch promises
    for (let i = 0; i < numBatches; i++) {
      batchPromises.push(
        StatsCivsModel.find({
          matchDay: { $gte: startDate, $lte: endDate },
          "metaField.lower_elo": { $gte: lowerElo },
          "metaField.upper_elo": { $lte: higherElo },
        })
          .limit(batchSize)
          .skip(i * batchSize)
          .lean()
      );
    }

    // Execute all batch queries in parallel
    const results = await Promise.all(batchPromises);

    // Flatten the results
    return results.flat();
  } catch (error: any) {
    throw new Error("Error fetching civ stats: " + error.message);
  }
}

export interface CivStatRollup {
  godName: string;
  totalGames: number;
  totalWins: number;
  winRate: number;
  pickRate: number;
}

export interface MappedCivStats {
  civStats: CivStatRollup[];
  totalGamesAnalyzed: number;
}

export function mapCivStats(civStats: IStatsCivs[]): MappedCivStats {
  // create a map of civ_id if it doesn't exist
  const civMap = new Map<number, CivStatRollup>();
  let totalGamesAnalyzed = 0;
  for (const stat of civStats) {
    const civ_id = stat.metaField.civ_id;
    if (!civMap.has(civ_id)) {
      civMap.set(civ_id, {
        godName: stat.metaField.god_name,
        totalGames: 0,
        totalWins: 0,
        winRate: 0,
        pickRate: 0,
      });
    }

    // Aggregate values
    const civ = civMap.get(civ_id)!;
    civ.totalGames += stat.totalResults;
    civ.totalWins += stat.totalWins;
    totalGamesAnalyzed += stat.totalResults;
  }

  // calculate winRate and pickRate
  const statsArr = Array.from(civMap.values()).map((stat) => {
    stat.winRate = stat.totalWins / stat.totalGames;
    stat.pickRate = stat.totalGames / totalGamesAnalyzed;
    return stat;
  });
  return {
    civStats: statsArr,
    totalGamesAnalyzed: totalGamesAnalyzed / 2,
  };
}
