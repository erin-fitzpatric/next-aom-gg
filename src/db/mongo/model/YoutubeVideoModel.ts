import mongoose, { model } from "mongoose";
import YoutubeVideoSchema from "../schemas/youtube/YoutubeVideoSchema";

const YoutubeVideoModel = mongoose.models.YoutubeVideo || model("YoutubeVideo", YoutubeVideoSchema);

export default YoutubeVideoModel;
