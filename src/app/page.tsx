import FeaturedYoutubeVideos from "@/components/featured-youtube-videos";
import Leaderboard from "@/components/leaderboard";
import RedditFeed from "@/components/reddit-feed";
import { Metadata } from "next";
import TopRecordedGames from "@/components/recs/top-recorded-games";

export const metadata: Metadata = {
  title: "Home - AoM.gg",
  description:
    "AoM.gg is your home for Age of Mythology Retold leaderboards, news, recorded games, and more. Built by FitzBro for the AoM community.",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-4 space-y-4">
      {/* Reddit API */}
      <div>
        <RedditFeed />
      </div>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 gap-5">
        <div className="w-full sm:w-[400px] order-2 sm:order-none">
          <TopRecordedGames />
        </div>
        <div className="w-full sm:w-5/6 order-1 sm:order-none">
          <Leaderboard />
        </div>
        <div className="w-full sm:w-[400px] order-3 sm:order-none">
          <FeaturedYoutubeVideos />
        </div>
      </div>
    </main>
  );
}
