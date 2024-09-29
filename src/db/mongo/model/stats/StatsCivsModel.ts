import mongoose, { model } from "mongoose";

const statsCivsSchema = new mongoose.Schema(
  {
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
    totalWins: {
      type: Number,
      required: true,
    },
    avgDurationMins: {
      type: Number,
      required: true,
    },
    maps: {
      type: Map,
      of: {
        totalResults: {
          type: Number,
          required: true,
        },
        totalWins: {
          type: Number,
          required: true,
        },
      },
    },
    matchups: {
      type: Map,
      of: {
        totalResults: {
          type: Number,
          required: true,
        },
        totalWins: {
          type: Number,
          required: true,
        },
      },
    },
    totalResults: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

export interface IStatsCivs extends mongoose.Document {
  matchDay: Date;
  metaField: {
    civ_id: number;
    elo_bin: string;
    god_name: string;
    lower_elo: number;
    upper_elo: number;
  };
  totalWins: number;
  avgDurationMins: number;
  maps: {
    [mapName: string]: {
      totalResults: number;
      totalWins: number;
    };
  };
  matchups: {
    [godName: string]: {
      totalResults: number;
      totalWins: number;
    };
  };
  totalResults: number;
}

export const StatsCivsModel = (mongoose.Model<IStatsCivs> =
  mongoose.models.Stats_Civs ||
  model<IStatsCivs>("Stats_Civs", statsCivsSchema));
