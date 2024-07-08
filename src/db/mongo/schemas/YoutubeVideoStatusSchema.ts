import mongoose from "mongoose";
const Schema = mongoose.Schema;

const YoutubeVideoStatusSchema = new Schema({
  uploadStatus: { type: String, required: true },
  privacyStatus: { type: String, required: true },
  license: { type: String, required: true },
  embeddable: { type: Boolean, required: true },
  publicStatsViewable: { type: Boolean, required: true },
});

export default YoutubeVideoStatusSchema;