import FeaturedYoutubeVideos from "@/components/featured-youtube-videos";
import Leaderboard from "@/components/leaderboard";
import RedditFeed from "@/components/reddit-feed";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home - AoM.gg",
  description:
    "AoM.gg is your home for Age of Mythology Retold leaderboards, news, recorded games, and more. Built by FitzBro for the AoM community.",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-4 space-y-4">
      {/* Reddit API*/}
      <div>
        <RedditFeed />
      </div>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0">
        {/* Ageofempires.com API */}
        <div className="w-full sm:w-5/6 mb-4 sm:mb-0 sm:mr-4">
          <Leaderboard />
        </div>
        {/* Google API */}
        <div className="flex-1">
          <FeaturedYoutubeVideos />
        </div>
      </div>
    </main>
  );
}
