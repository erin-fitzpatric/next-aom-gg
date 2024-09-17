"use server";

import { RedditPost } from "@/types/RedditPost";
import querystring from "querystring";

let mappedPosts: RedditPost[];
export default async function fetchRedditPosts(): Promise<RedditPost[]> {
  if (mappedPosts) return mappedPosts; // return cached posts
  const { USER_AGENT } = process.env;
  const accessToken = await getAccessToken();
  if (!USER_AGENT) {
    throw new Error("USER_AGENT environment variable is required");
  }
  try {
    const response = await fetch(
      `https://oauth.reddit.com/r/ageofmythology/hot`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": USER_AGENT,
        },
      }
    );

    const data = await response.json();
    const posts: any[] = data.data.children.map((child: any) => child.data);
    mappedPosts = posts
      .filter((post) => !post.stickied)
      .map((post) => ({
        id: post.id,
        thumbnail_height: post.thumbnail_height,
        ups: post.ups,
        thumbnail_width: post.thumbnail_width,
        url: post.is_self || post.is_video ? null : post.url,
        author: post.author,
        title: post.title,
        permalink: post.permalink,
        total_awards_received: post.total_awards_received,
        num_comments: post.num_comments,
      }));

    return mappedPosts;
  } catch (error) {
    throw new Error(`Failed to fetch reddit posts: ${error}`);
    console.error(error)
  }
}

async function getAccessToken(): Promise<string> {
  const { REDDIT_CLIENT_ID, REDDIT_SECRET } = process.env;
  const auth = Buffer.from(`${REDDIT_CLIENT_ID}:${REDDIT_SECRET}`).toString(
    "base64"
  );
  const response: any = await fetch(
    "https://www.reddit.com/api/v1/access_token",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "aom-stats/1.0 by FitzBro",
      },
      body: querystring.stringify({
        grant_type: "client_credentials",
      }),
    }
  );

  const data = await response.json();
  return data.access_token;
}
