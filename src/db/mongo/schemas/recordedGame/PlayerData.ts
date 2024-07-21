import mongoose from "mongoose";
import { recMetadataSchemaHelper } from "@/utils/utils";
import { RecordedGamePlayerMetadataBooleans, RecordedGamePlayerMetadataNumbers, RecordedGamePlayerMetadataStrings } from "@/types/RecordedGame";

const Schema = mongoose.Schema;

const PlayerDataSchema = new Schema(
  {
    ...recMetadataSchemaHelper(RecordedGamePlayerMetadataBooleans, Boolean, false),
    ...recMetadataSchemaHelper(RecordedGamePlayerMetadataStrings, String, ""),
    ...recMetadataSchemaHelper(RecordedGamePlayerMetadataNumbers, Number, 0),
  },
  { timestamps: true }
);

export default PlayerDataSchema;
