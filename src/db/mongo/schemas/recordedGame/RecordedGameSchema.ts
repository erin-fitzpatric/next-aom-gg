import mongoose from "mongoose";
import PlayerDataSchema from "./PlayerData";
import { recMetadataSchemaHelper } from "@/utils/utils";
import { RecordedGameMetadataBooleans, RecordedGameMetadataNumbers, RecordedGameMetadataStrings } from "@/types/RecordedGame";

const Schema = mongoose.Schema;

const RecordedGameSchema = new Schema(
  {
    playerdata: { type: [PlayerDataSchema], required: true },
    buildnumber: { type: Number, required: true, default: 0}, 
    buildstring: { type: String, required: true, default: ""}, 
    ...recMetadataSchemaHelper(RecordedGameMetadataBooleans, Boolean, false),
    ...recMetadataSchemaHelper(RecordedGameMetadataStrings, String, ""),
    ...recMetadataSchemaHelper(RecordedGameMetadataNumbers, Number, 0),
  },
  { timestamps: true }
);

// define indexes
RecordedGameSchema.index({ gameguid: 1 }, { unique: true });

export default RecordedGameSchema;
