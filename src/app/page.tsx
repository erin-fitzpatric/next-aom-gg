import LeaderboardPage from "@/components/leaderboard/page";
import { ModeToggle } from "@/components/ui/mode-toggle";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-10 space-y-4">
      <div className="">
        <ModeToggle />
      </div>
      <div className="w-3/4 self-center"> 
        <LeaderboardPage />
      </div>
    </main>
  );
}
