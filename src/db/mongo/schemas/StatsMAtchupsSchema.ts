import { Schema } from "mongoose";

export const StatsMatchupsSchema = new Schema({
  civ_id: Number,
  elo_bin: String,
  opp_id: Number,
  god_name: String,
  opp_god_name: String,
  totalResults: Number,
  totalWins: Number,
  winRate: Number,
});