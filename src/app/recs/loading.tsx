import { Spinner } from "@/components/spinner";
import BannerAd from "@/components/ads/bannerAd";

export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="flex justify-center">
        {/* Vertical Left Banner Ad */}
        <div className="hidden lg:block pr-2">
          <BannerAd adSlot={2054113074} width={160} height={600} />
        </div>

        {/* Main Content Loading State */}
        <div className="flex-1">
          <div className="flex justify-center mt-4">
            <Spinner />
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
