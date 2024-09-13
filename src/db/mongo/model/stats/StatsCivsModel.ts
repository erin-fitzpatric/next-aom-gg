import mongoose, { model } from "mongoose";

const statsCivsSchema = new mongoose.Schema({
  matchDay: {
    type: Date,
    required: true,
  },
  metaField: {
    civ_id: {
      type: Number,
      required: true,
    },
    elo_bin: {
      type: String,
      required: true,
    },
    god_name: {
      type: String,
      required: true,
    },
    lower_elo: {
      type: Number,
      required: true,
    },
    upper_elo: {
      type: Number,
      required: true,
    },
  },
  totalResultsinEloBracket: {
    type: Number,
    required: true,
  },
  winRate: {
    type: Number,
    required: true,
  },
  totalResults: {
    type: Number,
    required: true,
  },
  playRate: {
    type: Number,
    required: true,
  },
  totalWins: {
    type: Number,
    required: true,
  },
  avgDurationMins: {
    type: Number,
    required: true,
  },
});

export interface IStatsCivs extends mongoose.Document {
  matchDay: Date;
  metaField: {
    civ_id: number;
    elo_bin: string;
    god_name: string;
    lower_elo: number;
    upper_elo: number;
  };
  totalResultsinEloBracket: number;
  winRate: number;
  totalResults: number;
  playRate: number;
  totalWins: number;
  avgDurationMins: number;
}

export const StatsCivsModel = mongoose.Model<IStatsCivs> = mongoose.models.Stats_Civs || model<IStatsCivs>("Stats_Civs", statsCivsSchema);
