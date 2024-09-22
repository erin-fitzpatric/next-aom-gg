"use server";

import YoutubeVideoModel from "@/db/mongo/model/YoutubeVideoModel";
import getMongoClient from "@/db/mongo/mongo-client";
import { IYoutubeThumbnail, IYoutubeVideo } from "@/types/YoutubeTypes";
import { google } from "googleapis";

const youtubeClient = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

const FITZBRO_CHANNEL_ID = "UCnwcH2ufz2_Tq0gr8IIa5wg";

export async function fetchNewYoutubeVideos(): Promise<IYoutubeVideo[]> {
  const channelResponse = await youtubeClient.channels.list({
    id: [FITZBRO_CHANNEL_ID],
    part: ["contentDetails"],
  });

  const uploadsPlaylistId =
    channelResponse.data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  const playlistItemsResponse = await youtubeClient.playlistItems.list({
    playlistId: uploadsPlaylistId,
    part: ["snippet"],
    maxResults: 6,
  });
  if (!playlistItemsResponse.data.items) {
    throw new Error("Unable to fetch new youtube videos");
  }
  const mappedVideoData = playlistItemsResponse.data.items.map((item) => {
    if (
      !item.snippet ||
      !item.snippet.publishedAt ||
      !item.snippet.resourceId?.videoId ||
      !item.snippet.channelId ||
      !item.snippet.title ||
      !item.snippet.description ||
      !item.snippet.thumbnails ||
      !item.snippet.channelTitle
    ) {
      throw new Error("Unable to fetch new youtube videos");
    }
    return {
      videoId: item?.snippet?.resourceId?.videoId,
      snippet: {
        publishedAt: new Date(item.snippet.publishedAt),
        channelId: item?.snippet?.channelId,
        title: item?.snippet?.title,
        description: item?.snippet?.description,
        thumbnails: item?.snippet?.thumbnails as IYoutubeThumbnail,
        channelTitle: item?.snippet?.channelTitle,
      },
    };
  });
  // Save results to mongo
  await getMongoClient();
  const youtubeVideoDocs = mappedVideoData.map((video: IYoutubeVideo) => {
    return new YoutubeVideoModel(video);
  });
  await YoutubeVideoModel.insertMany(youtubeVideoDocs);
  return mappedVideoData;
}

export async function getStoredYoutubeVideos(): Promise<IYoutubeVideo[]> {
  await getMongoClient();
  let todaysVideos: IYoutubeVideo[] = [];
  try {
    const result = await YoutubeVideoModel.find({
      // created at today
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      },

    }).sort('asc').limit(6);
    todaysVideos = result.map((video) => {
      return {
        videoId: video.videoId,
        snippet: {
          publishedAt: video.snippet.publishedAt,
          channelId: video.snippet.channelId,
          title: video.snippet.title,
          description: video.snippet.description,
          thumbnails: {
            default: {
              url: video.snippet.thumbnails.default.url,
              width: video.snippet.thumbnails.default.width,
              height: video.snippet.thumbnails.default.height
            },
            medium: {
              url: video.snippet.thumbnails.medium.url,
              width: video.snippet.thumbnails.medium.width,
              height: video.snippet.thumbnails.medium.height
            },
            high: {
              url: video.snippet.thumbnails.high.url,
              width: video.snippet.thumbnails.high.width,
              height: video.snippet.thumbnails.high.height
            },
          },
          channelTitle: video.snippet.channelTitle,
        },
        createdAt: video.createdAt,
      };
    });
  } catch (error) {
    console.log(error);
    console.log("Unable to fetch stored videos");
  }
  return todaysVideos;
}
