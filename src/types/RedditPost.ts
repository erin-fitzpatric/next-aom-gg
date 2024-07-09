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