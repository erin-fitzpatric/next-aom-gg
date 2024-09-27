import ResourcesPage from "@/components/resources";
import { Spinner } from "@/components/spinner";
import { Metadata } from "next";
import { Suspense } from "react";
import BannerAd from "@/components/ads/bannerAd";  // Import BannerAd component

export const metadata: Metadata = {
  title: "Resources - AoM.gg",
  description:
    "AoM.gg is your home for Age of Mythology Retold leaderboards, news, recorded games, and more. Built by FitzBro for the AoM community.",
};

export default function Resources() {
  return (
    <div>
      {/* Page Wrapper with Vertical Banner Ads */}
      <div className="min-h-screen bg-background antialiased flex justify-center">
        {/* Vertical Left Banner Ad */}
        <div className="hidden lg:block">
          <BannerAd adSlot={2054113074} width={160} height={600} />
        </div>

        {/* Main Content Wrapper */}
        <div className="flex-1 w-full max-w-screen-xl mx-auto px-2">
          <Suspense
            fallback={
              <div className="flex justify-center mt-4">
                <Spinner />
              </div>
            }
          >
            <ResourcesPage />
          </Suspense>
        </div>

        {/* Vertical Right Banner Ad */}
        <div className="hidden lg:block">
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
