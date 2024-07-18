import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ThumbnailSchema = new Schema({
  url: { type: String, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true }
})

const YoutubeSnippetThumbnailSchema = new Schema({
  default: {
    type: ThumbnailSchema,
    required: true,
  },
  medium: {
    type: ThumbnailSchema,
    required: true,
  },
  high: {
    type: ThumbnailSchema,
    required: true,
  },
  standard: {
    type: ThumbnailSchema,
    required: false,
  }, // Optional
  maxres: {
    type: ThumbnailSchema,
    required: false,
  }, // Optional
});

export default YoutubeSnippetThumbnailSchema;
