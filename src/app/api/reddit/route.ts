import { mapRedditPost } from "./service";

export const GET = async function GET(req: Request) {
    try {
      // fetch reddit posts
      const redditPostsJSON = await fetch(
        `https://www.reddit.com/r/AgeofMythology/hot.json`
      );
      const data = await redditPostsJSON.json();
      const redditPosts: any[] = data.data.children.map((child: any) => child.data);
      const mappedPosts = redditPosts.filter((post) => !post.stickied).map(mapRedditPost);
  
      return new Response(JSON.stringify(mappedPosts), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=43200, stale-while-revalidate=43200",
          },
      });
    } catch (error: any) {
      return new Response(
        JSON.stringify({ error: "Error fetching reddit posts" }),
        { status: 500, statusText: "Error fetching reddit posts", headers: { "Content-Type": "application/json" } }
      );
    }
  };

