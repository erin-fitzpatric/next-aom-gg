"use server";

export interface RedditPost {
  id: string;
  thumbnail_height?: number;
  ups: number;
  thumbnail_width?: number;
  url?: string;
  author: string;
  title: string;
  permalink: string;
  total_awards_received: number;
  num_comments: number;
}
let mappedPosts: RedditPost[];
export default async function fetchRedditPosts(): Promise<RedditPost[]> {
  if (mappedPosts.length > 0) return mappedPosts; // return cached posts
  try {
    const url = "https://www.reddit.com/r/AgeofMythology.json?limit=25";
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });
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
    console.error("Error fetching reddit posts", error);
    return [];
  }
}
