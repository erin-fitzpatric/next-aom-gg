import { StatsMatchupModel } from "@/db/mongo/model/StatsMatchupsModel";
import getMongoClient from "@/db/mongo/mongo-client";

type MatchupStats = {
  _id: MatchupDetail;
  totalResulsts: number;
  totalWins: number;
  winRate: number;
}

type MatchupDetail = {
  civ_id: number;
  elo_bin: string;
  opp_id: number;
  god_name: string;
  opp_god_name: string;
}

export async function fetchMatchupStats(civId: string, eloBin: string): Promise<MatchupStats> {
  await getMongoClient();

  await getMongoClient();
  try {
    const result = await StatsMatchupModel.find({
      _id.civ_id = civId,
    }).lean();
    return result.json();
  } catch (error: any) {
    throw new Error("Error fetching matchup stats", error);
  }
}