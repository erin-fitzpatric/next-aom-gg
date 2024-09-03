import ResourcesPage from "@/components/resources";
import { Spinner } from "@/components/spinner";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Resources - AoM.gg",
  description:
    "AoM.gg is your home for Age of Mythology Retold leaderboards, news, recorded games, and more. Built by FitzBro for the AoM community.",
};

export default function Resources() {
  return (
    <main className="flex min-h-screen flex-col space-y-4">
      <div>
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
    </main>
  );
}
