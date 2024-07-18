import mongoose from "mongoose";
import PlayerDataSchema from "./PlayerData";
import { RecordedGameMetadataKeySchema } from "@/types/RecordedGame";

const Schema = mongoose.Schema;

const RecordedGameSchema = new Schema(
  {
    playerdata: { type: [PlayerDataSchema], required: true },
    buildnumber: { type: Number, required: true, default: 0}, 
    buildstring: { type: String, required: true, default: ""}, 
    ...RecordedGameMetadataKeySchema,
  },
  { timestamps: true }
);

// define indexes
RecordedGameSchema.index({ gameguid: 1 }, { unique: true });

export default RecordedGameSchema;
