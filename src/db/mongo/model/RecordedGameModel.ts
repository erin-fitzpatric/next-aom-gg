import mongoose, { model } from "mongoose";
import RecordedGameSchema from "../schemas/recordedGame/RecordedGameSchema";
import { IRecordedGame } from "@/types/RecordedGame";

const RecordedGameModel: mongoose.Model<IRecordedGame> = mongoose.models.RecordedGames || model<IRecordedGame>("RecordedGames", RecordedGameSchema);

export default RecordedGameModel;
