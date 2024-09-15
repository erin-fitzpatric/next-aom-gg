import { Schema } from "mongoose";

export const buildSchema = new Schema({
  buildNumber: { type: Number, required: true },
  releaseDate: { type: Date, required: true },
});

buildSchema.index({ buildNumber: 1 }, { unique: true });