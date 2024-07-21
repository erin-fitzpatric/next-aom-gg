"use server";

import { IYoutubeVideo } from "@/types/YoutubeTypes";
import {
  fetchNewYoutubeVideos,
  getStoredYoutubeVideos,
} from "../services/youtube-service";

export default async function getYoutubeVideos() {
  let todaysVideos: IYoutubeVideo[] = [];
  try {
    todaysVideos = await getStoredYoutubeVideos();
  } catch {
    console.log(
      "Unable to fetch stored videos, fetching new videos instead..."
    );
  }

  if (todaysVideos.length === 0) {
    todaysVideos = await fetchNewYoutubeVideos();
  }
  return todaysVideos;
}
