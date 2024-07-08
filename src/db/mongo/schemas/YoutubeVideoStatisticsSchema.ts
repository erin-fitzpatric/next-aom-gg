import mongoose from "mongoose";
const Schema = mongoose.Schema;

const YoutubeVideoStatisticsSchema = new Schema({
  viewCount: { type: String, required: true },
  likeCount: { type: String, required: true },
  dislikeCount: { type: String, required: true },
  favoriteCount: { type: String, required: true },
  commentCount: { type: String, required: true },
});

export default YoutubeVideoStatisticsSchema;