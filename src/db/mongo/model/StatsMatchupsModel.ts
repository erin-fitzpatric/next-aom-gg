import mongoose, { model } from "mongoose";
import { StatsMatchupsSchema } from "../schemas/StatsMAtchupsSchema";

export interface IStatsMatchup {
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
};

export const StatsMatchupModel: mongoose.Model<IStatsMatchup> =
  mongoose.models.StatsMatchup ||
  model<IStatsMatchup>("stats_matchups_elobins", StatsMatchupsSchema);
