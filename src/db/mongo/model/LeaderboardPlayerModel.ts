import mongoose, { model } from "mongoose";
import { ILeaderboardPlayer } from "@/types/LeaderboardPlayer";
import { LeaderboardPlayerSchema } from "../schemas/LeaderboardPlayerSchema";

export const LeaderboardPlayerModel: mongoose.Model<ILeaderboardPlayer> = mongoose.models.LeaderboardPlayers || model<ILeaderboardPlayer>("LeaderboardPlayers", LeaderboardPlayerSchema);