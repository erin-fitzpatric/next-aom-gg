"use client";

import { memo } from "react";
import { useSearchParams } from "next/navigation";
import { useRecordedGames } from "@/hooks/useRecordedGames";
import { IRecordedGame } from "@/types/RecordedGame";

// Components
import RecFilters from "./filters/rec-filters";
import Loading from "../loading";
import RecUploadForm from "./rec-upload-form";
import { HelpCard } from "./help-card";
import { GameGallery } from "./game-gallery";

/**
 * RecordedGames - Main component for displaying and managing recorded games
 *
 * This component handles:
 * 1. Fetching and displaying recorded games
 * 2. Filtering functionality
 * 3. Upload capabilities
 * 4. Loading states
 */
function RecordedGames() {
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
  if (initialFetch.current && buildNumbers.length === 0) {
    return <Loading />;
  }

  return (
    <div className="relative">
      {/* Filters Section */}
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

      {/* Help Information */}
      <div className="flex justify-center pb-2">
        <HelpCard />
      </div>

      {/* Game Gallery with Smooth Loading Transitions */}
      <GameGallery
        recs={recs as IRecordedGame[]}
        isLoading={isLoading}
        setRecs={setRecs as React.Dispatch<React.SetStateAction<IRecordedGame[]>>}
      />

      {/* Upload Form - Fixed Position */}
      <div className="fixed bottom-4 right-4 mr-2">
        <RecUploadForm
          setRecs={setRecs as React.Dispatch<React.SetStateAction<IRecordedGame[]>>}
          filters={filters}
        />
      </div>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(RecordedGames);
