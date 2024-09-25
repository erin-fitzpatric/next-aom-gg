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
    <div className="min-h-screen lg:px-44">
      {/* Reddit API */}
      <div>
        <RedditFeed />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5 pt-4">
        <div className="xl:col-span-3 order-1">
          <Leaderboard />
        </div>
        <div className="xl:col-span-1 order-2 space-y-4">
          <div>
            <FeaturedYoutubeVideos />
          </div>
          <div>
            <TopRecordedGames />
          </div>
        </div>
      </div>
    </div>
  );
}
