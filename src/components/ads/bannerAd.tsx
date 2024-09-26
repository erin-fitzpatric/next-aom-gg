import Script from "next/script";

interface BannerAdProps {
  adSlot: number;
  width: number;
  height: number;
}

const BannerAd = ({ adSlot, width, height }: BannerAdProps) => {
  return (
    <div>
      {/* Google AdSense Script */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5753721803474857"
        crossOrigin="anonymous"
        strategy="afterInteractive" // Ensures script loads after the page is interactive
      />

      {/* Banner Ad */}
      <ins
        className="adsbygoogle"
        style={{ display: "inline-block", width: `${width}px`, height: `${height}px` }}
        data-ad-client="ca-pub-5753721803474857"
        data-ad-slot={adSlot}
      ></ins>

      {/* Each ad should have a unique Script ID */}
      <Script id={`ads-init-${adSlot}`}>
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>
    </div>
  );
};

export default BannerAd;
