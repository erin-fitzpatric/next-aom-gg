"use server";

import YoutubeVideoModel from "@/db/mongo/model/YoutubeVideoModel";
import getMongoClient from "@/db/mongo/mongo-client";
import { IYoutubeThumbnail, IYoutubeVideo } from "@/types/YoutubeTypes";
import { google } from "googleapis";

const youtubeClient = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

export async function fetchNewYoutubeVideos(): Promise<IYoutubeVideo[]> {
  try {
    // Step 1: Fetch videos sorted by date
    const searchResponse = await youtubeClient.search.list({
      part: ["snippet"], // Required: includes video details
      q: "Age of Mythology: Retold", // Game title
      type: ["video"], // Restrict results to videos
      videoCategoryId: "20", // Gaming category
      maxResults: 25, // Adjust as needed
      order: "date", // Sort by date
      regionCode: "US", // Optional: Region filter
      relevanceLanguage: "en", // Optional: Language filter
    });

    const searchItems = searchResponse.data.items || [];
    if (searchItems.length === 0) {
      throw new Error("No videos found for the specified query.");
    }

    // Step 2: Extract video IDs
    const videoIds = searchItems
      .map((item) => item.id?.videoId)
      .filter(Boolean) as string[];

    if (videoIds.length === 0) {
      throw new Error("No valid video IDs found in search results.");
    }

    // Step 3: Fetch video statistics for view count
    const statsResponse = await youtubeClient.videos.list({
      part: ["statistics"],
      id: videoIds,
    });

    const videoStatsMap = new Map(
      statsResponse.data.items?.map((video) => [
        video.id,
        video.statistics?.viewCount || 0,
      ])
    );

    // Step 4: Map video data
    const mappedVideoData = searchItems.map((item) => {
      if (
        !item.snippet ||
        !item.snippet.publishedAt ||
        !item.snippet.channelId ||
        !item.snippet.title ||
        !item.snippet.thumbnails ||
        !item.snippet.channelTitle
      ) {
        throw new Error("Invalid video data received from API.");
      }

      return {
        videoId: item.id?.videoId,
        snippet: {
          publishedAt: new Date(item.snippet.publishedAt),
          channelId: item.snippet.channelId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnails: item.snippet.thumbnails as IYoutubeThumbnail,
          channelTitle: item.snippet.channelTitle,
        },
        viewCount: videoStatsMap.get(item.id?.videoId) || 0,
      } as IYoutubeVideo;
    });

    // Step 5: Sort videos by view count (popularity) in descending order and limit to 6
    const sortedVideos = mappedVideoData.sort(
      (a, b) => (b.viewCount || 0) - (a.viewCount || 0)
    ).slice(0, 6);

    // Step 6: Save results to MongoDB
    await getMongoClient();
    const youtubeVideoDocs = sortedVideos.map((video: IYoutubeVideo) => {
      return new YoutubeVideoModel(video);
    });
    await YoutubeVideoModel.insertMany(youtubeVideoDocs);

    return sortedVideos;
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    throw new Error("Unable to fetch new YouTube videos.");
  }
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
