import mongoose from "mongoose";
import YoutubeVideoSnippetSchema from "./YoutubeVideoSnippetSchema";

const Schema = mongoose.Schema;

const YoutubeVideoSchema = new Schema(
  {
    videoId: { type: String, required: true },
    snippet: { type: YoutubeVideoSnippetSchema, required: true },
  },
  { timestamps: true }
);

export default YoutubeVideoSchema;
