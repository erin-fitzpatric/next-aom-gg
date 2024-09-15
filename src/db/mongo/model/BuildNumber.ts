import mongoose, { model } from "mongoose";
import { buildSchema } from "../schemas/BuildSchema";
import { Build } from "@/types/Build";
export const BuildModel: mongoose.Model<Build> =
  mongoose.models.Matches || model<typeof buildSchema>("Build", buildSchema);
