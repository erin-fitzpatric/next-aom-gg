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
      order: "viewCount", // Sort by view count
      regionCode: "US", // Optional: Region filter
      relevanceLanguage: "en", // Optional: Language filter,
      publishedAfter: new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000
      ).toISOString(), // Last 7 days
      videoDuration: "any", // Excludes Shorts
    });

    const searchItems = searchResponse.data.items || [];
    if (!searchItems.length) throw new Error("No videos found for the specified query.");


    // Step 2: Extract video IDs
    const videoIds = searchItems.map((item) => item.id?.videoId).filter(Boolean) as string[];
    if (!videoIds.length) throw new Error("No valid video IDs found in search results.");


    // Step 3: Fetch video statistics for view count
    const statsResponse = await youtubeClient.videos.list({
      part: ["statistics, contentDetails, liveStreamingDetails, snippet"],
      id: videoIds,
    });

    // Step 4: Filter out live videos, previously live videos, and Shorts
    const filteredVideos = (statsResponse.data.items ?? []).filter((video) => {
      const isEnglish =
        video.snippet?.defaultAudioLanguage?.startsWith("en") ||
        video.snippet?.defaultLanguage?.startsWith("en");

      const durationInSeconds = parseISO8601DurationToSeconds(video.contentDetails?.duration ?? undefined);
      const isNotShort = durationInSeconds >= 60; // Exclude Shorts
      const isNotLive = !video.liveStreamingDetails; // Exclude live videos
      const hasValidDuration = video.contentDetails?.duration !== "PT0S"; // Exclude indefinite duration

      return isEnglish && isNotShort && isNotLive && hasValidDuration;
    });

    if (!filteredVideos.length) throw new Error("No valid videos after filtering.");



    // Step 5: Map video data for mongoDB insertion
    const videoStatsMap = new Map(
      filteredVideos.map((video) => [
        video.id,
        video.statistics?.viewCount || 0,
      ])
    );
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

    // Step 6: Sort videos by view count (popularity) in descending order and limit to 6
    const sortedVideos = mappedVideoData
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 6)
      .sort((a, b) => b.snippet.publishedAt.getTime() - a.snippet.publishedAt.getTime()); // Sort by publish date in descending order

    // Step 7: Save results to MongoDB
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

function parseISO8601DurationToSeconds(duration: string | undefined): number {
  if (!duration) return 0;

  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const hours = parseInt(match?.[1] || "0", 10);
  const minutes = parseInt(match?.[2] || "0", 10);
  const seconds = parseInt(match?.[3] || "0", 10);

  return hours * 3600 + minutes * 60 + seconds;
}

export async function getStoredYoutubeVideos(): Promise<IYoutubeVideo[]> {
  await getMongoClient();
  let todaysVideos: IYoutubeVideo[] = [];
  try {
    const result = await YoutubeVideoModel.find({
      // created at today
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    })
      .sort("asc")
      .limit(6);
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
