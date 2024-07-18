"use server";

import YoutubeVideoModel from "@/db/mongo/model/YoutubeVideoModel";
import getMongoClient from "@/db/mongo/mongo-client";
import { YoutubeVideo } from "@/types/youtube";
import fetchYouTubeVideos from "./fetchYoutubeVideos";

function mapVideos(videos: YoutubeVideo[]): YoutubeVideo[] {
  return videos.map((video: any) => {
    return {
      kind: video.kind,
      etag: video.etag,
      id: {
        kind: video.id.kind,
        videoId: video.id.videoId,
      },
      snippet: {
        publishedAt: video.snippet.publishedAt,
        channelId: video.snippet.channelId,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnails: {
          default: {
            url: video.snippet.thumbnails.default.url,
            width: video.snippet.thumbnails.default.width,
            height: video.snippet.thumbnails.default.height,
          },
          medium: {
            url: video.snippet.thumbnails.medium.url,
            width: video.snippet.thumbnails.medium.width,
            height: video.snippet.thumbnails.medium.height,
          },
          high: {
            url: video.snippet.thumbnails.high.url,
            width: video.snippet.thumbnails.high.width,
            height: video.snippet.thumbnails.high.height,
          },
        },
        channelTitle: video.snippet.channelTitle,
        liveBroadcastContent: video.snippet.liveBroadcastContent,
      },
    };
  });
}

let youtubeVideos: YoutubeVideo[] = [];
async function fetchNewYoutubeVideos() {
  const result = await fetchYouTubeVideos();
  if (youtubeVideos.length === 0) {
    youtubeVideos = result.map((video: YoutubeVideo) => {
      return new YoutubeVideoModel(video);
    });
  }
  // save to db
  try {
    await YoutubeVideoModel.insertMany(youtubeVideos);
  } catch (error) {
    console.error("Error saving videos to db: ", error);
  }
  return youtubeVideos;
}

let storedVideos: YoutubeVideo[] = [];
export default async function getYoutubeVideos(): Promise<YoutubeVideo[]> {
  // Fetch videos from db that are less than 24 hours old
  await getMongoClient();
  if (storedVideos.length === 0) {
    storedVideos = await YoutubeVideoModel.find({
      createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    }).limit(3);
  }

  const youtubeVideos: YoutubeVideo[] =
    storedVideos.length === 0 ? await fetchNewYoutubeVideos() : storedVideos;

  const mappedVideos = mapVideos(youtubeVideos);
  return mappedVideos;
}
