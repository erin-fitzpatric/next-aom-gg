import mongoose from "mongoose";
const Schema = mongoose.Schema;

const YoutubeVideoContentDetailsSchema = new Schema({
  duration: { type: String, required: true },
  dimension: { type: String, required: true },
  definition: { type: String, required: true },
  caption: { type: String, required: true },
  licensedContent: { type: Boolean, required: true },
  projection: { type: String, required: true },
});

export default YoutubeVideoContentDetailsSchema;