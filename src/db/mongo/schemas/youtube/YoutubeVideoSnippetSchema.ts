import mongoose from "mongoose";
import YoutubeSnippetThumbnailSchema from "./YoutubeSnippetThumbnailSchema";
const Schema = mongoose.Schema;

const YoutubeVideoSnippetSchema = new Schema({
  publishedAt: { type: Date, required: true },
  channelId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: false },
  thumbnails: { type: YoutubeSnippetThumbnailSchema, required: true },
  channelTitle: { type: String, required: true },
});

export default YoutubeVideoSnippetSchema;
