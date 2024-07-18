"use server"

import { YoutubeVideo } from "@/types/YoutubeTypes";


// Function to fetch videos from YouTube API
export default async function fetchYouTubeVideos(): Promise<YoutubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY; //
  const query = encodeURIComponent("Age of Mythology: Retold"); // Tag to search for
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&key=${apiKey}`;

  const data: YoutubeVideo[] = [];
  try {
    const response = await fetch(url);
    const formattedResponse = await response.json();
    const { items } = formattedResponse;
    if (formattedResponse.error) {
      console.error("Error fetching data: ", formattedResponse.error.message);
      return [];
    }
    // Process the data
    data.push(...items);
    return data;
  } catch (error) {
    console.error("Error: ", error);
    return data;
  }
}