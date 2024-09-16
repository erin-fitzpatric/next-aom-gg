import mongoose, { model } from "mongoose";
import { buildSchema } from "../schemas/BuildSchema";
import { Build } from "@/types/Build";

export const BuildModel: mongoose.Model<Build> =
  mongoose.models.Builds || model<Build>("Builds", buildSchema);
