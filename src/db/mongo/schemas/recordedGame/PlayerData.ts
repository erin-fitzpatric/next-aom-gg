import mongoose from "mongoose";
import { RecordedGamePlayerMetadataKeySchema } from "@/types/RecordedGame";

const Schema = mongoose.Schema;

const PlayerDataSchema = new Schema(
  RecordedGamePlayerMetadataKeySchema,
  { timestamps: true }
);

export default PlayerDataSchema;
