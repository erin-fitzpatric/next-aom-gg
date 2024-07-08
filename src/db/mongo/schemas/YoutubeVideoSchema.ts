import mongoose from "mongoose";
import YoutubeVideoSnippetSchema from "./YoutubeVideoSnippetSchema";

const Schema = mongoose.Schema;

const YoutubeVideoSchema = new Schema(
  {
    kind: { type: String, required: true },
    etag: { type: String, required: true },
    id: {
      type: {
        kind: { type: String, required: true },
        videoId: { type: String, required: true }
      },
      required: true,
    },
    snippet: { type: YoutubeVideoSnippetSchema, required: true },
  },
  { timestamps: true }
);

export default YoutubeVideoSchema;
