import mongoose from "mongoose";
import { recMetadataSchemaHelper } from "@/utils/utils";
import { RecordedGamePlayerMetadataBooleansOptional, RecordedGamePlayerMetadataBooleansRequired, RecordedGamePlayerMetadataNumbersOptional, RecordedGamePlayerMetadataNumbersRequired, RecordedGamePlayerMetadataStringsOptional, RecordedGamePlayerMetadataStringsRequired } from "@/types/recParser/RecordedGameParser";

const Schema = mongoose.Schema;

const PlayerDataSchema = new Schema(
  {
    ...recMetadataSchemaHelper(RecordedGamePlayerMetadataBooleansRequired, Boolean, false, true),
    ...recMetadataSchemaHelper(RecordedGamePlayerMetadataStringsRequired, String, "", true),
    ...recMetadataSchemaHelper(RecordedGamePlayerMetadataNumbersRequired, Number, 0, true),
    ...recMetadataSchemaHelper(RecordedGamePlayerMetadataBooleansOptional, Boolean, false, false),
    ...recMetadataSchemaHelper(RecordedGamePlayerMetadataStringsOptional, String, "", false),
    ...recMetadataSchemaHelper(RecordedGamePlayerMetadataNumbersOptional, Number, 0, false),
  },
  { timestamps: true }
);

export default PlayerDataSchema;
