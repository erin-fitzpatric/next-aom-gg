import mongoose, { model } from "mongoose";
import RecordedGameSchema from "../schemas/recordedGame/RecordedGameSchema";
import { RecordedGameMetadata } from "@/types/RecordedGame";

const RecordedGameModel = mongoose.models.RecordedGames || model("RecordedGames", RecordedGameSchema);

export interface IRecordedGame extends RecordedGameMetadata {
  uploadedBy: string;
  gameTitle: string;
  createdAt: Date;
  downloadCount: number;
}

export default RecordedGameModel;
