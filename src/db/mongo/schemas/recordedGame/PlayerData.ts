import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PlayerDataSchema = new Schema(
  {
    name: { type: String, default: "" },
    teamid: { type: Number, default: 0 },
    clan: { type: String, default: "" },
    color: { type: Number, default: 0 },
    civ: { type: Number, default: 0 },
    civlist: { type: String, default: "" },
    type: { type: Number, default: 0 },
    status: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    handicap: { type: Number, default: 0 },
    aipersonality: { type: String, default: "" },
    aidifficulty: { type: Number, default: 0 },
    avatarid: { type: String, default: "" },
    rank: { type: String, default: "" },
    powerrating: { type: String, default: "" },
    winratio: { type: String, default: "" },
    ready: { type: Boolean, default: false },
    id: { type: Number, default: 0 },
    civishidden: { type: Boolean, default: false },
    civwasrandom: { type: Boolean, default: false },
    aotgblessings: { type: String, default: "" },
    pfentity: { type: String, default: "" },
    ugccheck: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default PlayerDataSchema;
