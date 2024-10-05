import FeaturedYoutubeVideos from "@/components/featured-youtube-videos";
import Leaderboard from "@/components/leaderboard";
import RedditFeed from "@/components/reddit-feed";
import { Metadata } from "next";
import TopRecordedGames from "@/components/recs/top-recorded-games";
import BannerAd from "@/components/ads/bannerAd";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Home - AoM.gg",
  description:
    "AoM.gg is your home for Age of Mythology Retold leaderboards, news, recorded games, and more. Built by FitzBro for the AoM community.",
};

export default function Home() {
  return (
    <div className="min-h-screen lg:px-4">
      {/* Reddit API */}
      <div>
        <RedditFeed />
      </div>
      {/* Horizontal Top Banner Ad */}
      <div className="flex mx-auto justify-center w-full pt-1">
        <BannerAd adSlot={5638566067} width={970} height={90} />
      </div>

      {/* Main Section with Vertical Banners */}
      <div className="flex justify-center">
        {/* Vertical Left Banner Ad */}
        <div className="hidden lg:block pr-2">
          <BannerAd adSlot={2054113074} width={160} height={600} />
        </div>

        {/* Main Content (Leaderboard, YouTube, TopRecordedGames) */}
        <div className="flex-1">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
            <div className="xl:col-span-3">
              <Suspense>
                <Leaderboard />
              </Suspense>
            </div>
            <div className="xl:col-span-1 space-y-4">
              <FeaturedYoutubeVideos />
              <TopRecordedGames />
            </div>
          </div>
        </div>

        {/* Vertical Right Banner Ad */}
        <div className="hidden lg:block pl-2">
          <BannerAd adSlot={9288136655} width={160} height={600} />
        </div>
      </div>

      {/* Horizontal Bottom Banner Ad */}
      <div className="flex mx-auto justify-center w-full py-1">
        <BannerAd adSlot={3398984337} width={728} height={90} />
      </div>
    </div>
  );
}
