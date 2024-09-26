import BannerAd from "@/components/ads/bannerAd";
import UnderConstruction from "@/components/statistics/under-construction";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="min-h-screen bg-background antialiased p-4 flex justify-center">
        {/* Vertical Left Banner Ad */}
        <div className="hidden lg:block pr-2">
          <BannerAd adSlot={2054113074} width={160} height={600} />
        </div>

        {/* Main Content Wrapper */}
        <div className="flex-1 w-full max-w-screen-xl mx-auto px-4 lg:px-0">
          <UnderConstruction />
          {children}
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
