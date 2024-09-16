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
} from "@/types/recParser/RecordedGameParser";

const Schema = mongoose.Schema;

const RecordedGameSchema = new Schema(
  {
    downloadCount: { type: Number, required: true, default: 0 },
    uploadedBy: { type: String, required: false }, // deprecated by uploadedByUserId
    uploadedByUserId: { type: String, required: true },
    gameTitle: { type: String, required: false },
    playerData: { type: [PlayerDataSchema], required: true },
    buildNumber: { type: Number, required: true, default: 0 },
    buildString: { type: String, required: true, default: "" },
    teamsFormatString: {type: String, required: false, default:""},
    parsedAt: { type: Date, required: true},
    version: { type: Number, required: false, default: 0},
    gameLength: {type: Number, required: false, default: 0},
    teams: { type: [[Number]]},
    commandParserError: { type: String, required: false, default: "" },
    unresignedPlayers: { type: [[Number]], required: false },
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
RecordedGameSchema.index({ gameGuid: 1 }, { unique: true });
RecordedGameSchema.index({ "$**": "text" });

export default RecordedGameSchema;
