import { RedditPost } from "@/types/RedditPost";

export const mapRedditPost = (redditPost: any): RedditPost => ({
    id: redditPost.id,
    thumbnail_height: redditPost.thumbnail_height,
    ups: redditPost.ups,
    thumbnail_width: redditPost.thumbnail_width,
    url: redditPost.is_self || redditPost.is_video ? null : redditPost.url,
    author: redditPost.author,
    title: redditPost.title,
    permalink: redditPost.permalink,
    total_awards_received: redditPost.total_awards_received,
    num_comments: redditPost.num_comments,
});