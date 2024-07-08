import FeaturedYoutubeVideos from "@/components/featured-youtube-videos";
import Header from "@/components/header";
import Leaderboard from "@/components/leaderboard";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-10 space-y-4">
      <div>
        <Header />
      </div>
      <div className="flex min-h-screen flex-row space-x-4">
        <div className="w-5/6">
          <Leaderboard/>
        </div>
        <div className="">
          <FeaturedYoutubeVideos />
        </div>
      </div>
    </main>
  );
}
