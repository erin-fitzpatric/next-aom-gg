import { Match } from "@/types/Match";
import mongoose, { model } from "mongoose";
import { matchSchema } from "../schemas/MatchScehma";
export const MatchModel: mongoose.Model<Match> =
  mongoose.models.Matches || model<typeof matchSchema>("Matches", matchSchema);
