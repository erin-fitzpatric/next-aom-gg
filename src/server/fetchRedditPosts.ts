"use server";

import { RedditPost } from "@/types/RedditPost";

let mappedPosts: RedditPost[];
export default async function fetchRedditPosts(): Promise<RedditPost[]> {
  const response = await fetch(
    "https://www.reddit.com/r/ageofmythology/hot.json",
    {
      headers: {
        "User-Agent": "aom-stats/1.0 by FitzBro",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Reddit posts: ${response.statusText}`);
  }

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
}
