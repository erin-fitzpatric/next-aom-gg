import {
  IStatsCivs,
  StatsCivsModel,
} from "@/db/mongo/model/stats/StatsCivsModel";
import getMongoClient from "@/db/mongo/mongo-client";

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
  if (eloRange !== "All") {
    [lowerElo, higherElo] = eloRange.split("-").map(Number);
  }

  await getMongoClient();
  try {
    const result: IStatsCivs[] = await StatsCivsModel.find({
      matchDay: { $gte: startDate, $lte: endDate },
      "metaField.lower_elo": { $gte: lowerElo },
      "metaField.upper_elo": { $lte: higherElo },
    }).lean();
    return result;
  } catch (error: any) {
    throw new Error("Error fetching civ stats: " + error.message);
  }
}

// TODO - clean this up
// export function mapCivStats(civStats: IStatsCivs[]): IStatsCivs[] {
//   const groupedStats = civStats.reduce((acc:any , stat) => {
//     const { civ_id } = stat.metaField;

//     if (!acc[civ_id]) {
//       acc[civ_id] = {
//         civ_id,
//         totalResultsinEloBracket: 0,
//         totalWins: 0,
//         avgDurationMins: 0,
//         playRate: 0,
//         totalResults: 0,
//         winRate: 0,
//       };
//     }

//     // Aggregate values
//     acc[civ_id].totalResultsinEloBracket += stat.totalResultsinEloBracket;
//     acc[civ_id].totalWins += stat.totalWins;
//     acc[civ_id].totalResults += stat.totalResults;

//     // For avgDurationMins, you will need to calculate the average
//     acc[civ_id].avgDurationMins += stat.avgDurationMins;

//     // For playRate, you may need to calculate the average if it's a rate
//     acc[civ_id].playRate += stat.playRate;

//     // For winRate, you should calculate the weighted average
//     acc[civ_id].winRate =
//       (acc[civ_id].winRate * acc[civ_id].totalResults +
//         stat.winRate * stat.totalResults) /
//       (acc[civ_id].totalResults + stat.totalResults);

//     return acc;
//   }, {});

//   return groupedStats;
// }

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
    totalGamesAnalyzed: totalGamesAnalyzed,
  };
}
