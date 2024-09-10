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
    <main className="min-h-screen p-4 space-y-4">
      {/* Reddit API */}
      <div>
        <RedditFeed />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        <div className="xl:col-span-1 order-2 xl:order-1">
          <TopRecordedGames />
        </div>
        <div className="xl:col-span-2 order-1 xl:order-2">
          <Leaderboard />
        </div>
        <div className="xl:col-span-1 order-3">
          <FeaturedYoutubeVideos />
        </div>
      </div>
    </main>
  );
}
