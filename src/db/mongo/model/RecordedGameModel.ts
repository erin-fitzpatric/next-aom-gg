import mongoose, { model } from "mongoose";
import RecordedGameSchema from "../schemas/recordedGame/RecordedGameSchema";

const RecordedGameModel = mongoose.models.RecordedGame || model("RecordedGame", RecordedGameSchema);

export default RecordedGameModel;
