import mongoose from "mongoose";
import PlayerDataSchema from "./PlayerData";
import { recMetadataSchemaHelper } from "@/utils/utils";
import {
  RecordedGameMetadataBooleansOptional,
  RecordedGameMetadataBooleansRequired,
  RecordedGameMetadataNumbersOptional,
  RecordedGameMetadataNumbersRequired,
  RecordedGameMetadataStringsOptional,
  RecordedGameMetadataStringsRequired,
} from "@/types/RecordedGameParser";

const Schema = mongoose.Schema;

const RecordedGameSchema = new Schema(
  {
    downloadCount: { type: Number, required: true, default: 0 },
    uploadedBy: { type: String, required: true },
    gameTitle: { type: String, required: true },
    playerData: { type: [PlayerDataSchema], required: true },
    buildNumber: { type: Number, required: true, default: 0 },
    buildString: { type: String, required: true, default: "" },
    parsedAt: { type: Date, required: true},
    teams: { type: [[Number]]},
    ...recMetadataSchemaHelper(RecordedGameMetadataBooleansRequired, Boolean, false, true),
    ...recMetadataSchemaHelper(RecordedGameMetadataStringsRequired, String, "", true),
    ...recMetadataSchemaHelper(RecordedGameMetadataNumbersRequired, Number, 0, true),
    ...recMetadataSchemaHelper(RecordedGameMetadataBooleansOptional, Boolean, false, false),
    ...recMetadataSchemaHelper(RecordedGameMetadataStringsOptional, String, "", false),
    ...recMetadataSchemaHelper(RecordedGameMetadataNumbersOptional, Number, 0, false),
  },
  { timestamps: true }
);

// define indexes
RecordedGameSchema.index({ gameguid: 1 }, { unique: true });

export default RecordedGameSchema;
