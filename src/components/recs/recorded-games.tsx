"use client";

import RecFilters from "./filters/rec-filters";
import Loading from "../loading";
import RecUploadForm from "./rec-upload-form";
import { useSearchParams } from "next/navigation";
import { useRecordedGames } from "@/hooks/useRecordedGames";
import { HelpCard } from "./help-card";
import { GameGallery } from "./game-gallery";

// Main component
export default function RecordedGames() {
  const searchParams = useSearchParams();
  const {
    recs,
    isLoading,
    filters,
    setFilters,
    buildNumbers,
    query,
    setQuery,
    selectedBuild,
    setSelectedBuild,
    setRecs,
    initialFetch,
  } = useRecordedGames(searchParams);

  // Show loading component during initial data fetch
  if (initialFetch.current && isLoading) {
    return <Loading />;
  }

  return (
    <div className="relative">
      {/* Filters */}
      <div className="flex flex-row-reverse">
        <RecFilters
          filters={filters}
          setFilters={setFilters}
          buildNumbers={buildNumbers}
          query={query}
          setQuery={setQuery}
          selectedBuild={selectedBuild}
          setSelectedBuild={setSelectedBuild}
        />
      </div>

      {/* Help Text */}
      <div className="flex justify-center pb-2">
        <HelpCard />
      </div>

      {/* Game Gallery */}
      <GameGallery recs={recs} isLoading={isLoading} setRecs={setRecs} />

      {/* Upload Form */}
      <div className="fixed bottom-4 right-4 mr-2">
        <RecUploadForm setRecs={setRecs} filters={filters} />
      </div>
    </div>
  );
}
