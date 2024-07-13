import FeaturedYoutubeVideos from "@/components/featured-youtube-videos";
import Header from "@/components/header";
import Leaderboard from "@/components/leaderboard";
import RedditFeed from "@/components/reddit-feed";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-10 space-y-4">
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0">
        <div className="w-full sm:w-5/6 mb-4 sm:mb-0 sm:mr-4">
          <Leaderboard />
        </div>
        <div className="flex-1">
          <FeaturedYoutubeVideos />
        </div>
      </div>
      {/* Reddit API Needs to be Auth'd to work in prod */}
      <div>
        <RedditFeed />
      </div>
    </main>
  );
}
