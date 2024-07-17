import RecordedGames from "@/components/recorded-games";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recorded Games - AoM.gg",
  description: "AoM.gg is your home for Age of Mythology Retold leaderboards, news, recorded games, and more. Built by FitzBro for the AoM community.",
};

export default function Recs() {
  return (
    <main className="flex min-h-screen flex-col p-10 space-y-4">
      <div>
        <RecordedGames />
      </div>
    </main>
  );
}
