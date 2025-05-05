"use client";

import { memo, useEffect, useState, useRef, useCallback } from "react";
import { Dispatch, SetStateAction } from "react";
import { IRecordedGame } from "@/types/RecordedGame";
import { cn } from "@/utils/utils";

// UI Components
import { Card } from "../ui/card";
import RecTile from "./rec-tile";
import { SpinnerWithText } from "../spinner";

// Types for component props
interface GameGalleryProps {
  recs: IRecordedGame[];
  isLoading: boolean;
  setRecs: Dispatch<SetStateAction<IRecordedGame[]>>;
}

/**
 * GameGallery - Displays a grid of recorded game tiles
 *
 * Features:
 * - Immediate content display without transitions
 * - Delayed "No results" message to prevent flickering
 * - Loading indicators
 * - Responsive grid layout
 */
export const GameGallery = memo(({ recs, isLoading, setRecs }: GameGalleryProps) => {
  // State for "No results" message
  const [showNoResults, setShowNoResults] = useState(false);

  // Handle "No results" message without delay
  useEffect(() => {
    // Show "No results" message immediately when not loading and no results
    if (!isLoading && recs.length === 0) {
      setShowNoResults(true);
    } else {
      // Reset no results state when loading or when we have results
      setShowNoResults(false);
    }
  }, [isLoading, recs.length]);

  // Memoized render function for individual game tiles
  const renderGameTile = useCallback((rec: IRecordedGame) => (
    <Card
      key={rec.gameGuid}
      className="bg-secondary rounded-lg m-1 p-2 flex w-fit"
    >
      <RecTile
        key={`rec-tile-${rec.gameGuid}`}
        rec={rec}
        setRecs={setRecs}
      />
    </Card>
  ), [setRecs]);

  // We'll handle the "No recorded games found!" message in the main return

  // We don't need to show the initial loading spinner anymore
  // as it's handled by Next.js loading.js
  // Only show loading spinner for subsequent data fetches (filtering, etc.)
  // if (isLoading && recs.length === 0) {
  //   return (
  //     <Card className="p-4">
  //       <div className="flex justify-center mt-4">
  //         <SpinnerWithText text={"Loading recorded games..."} />
  //       </div>
  //     </Card>
  //   );
  // }

  // Main gallery view without transition
  return (
    <Card className="p-4">
      <div>
        <div className="flex flex-row flex-wrap justify-center gap-2">
          {recs?.map(renderGameTile)}
        </div>

        {/* Loading indicator or No results message */}
        <div className="min-h-[100px] flex items-center justify-center">
          {(isLoading && recs.length === 0) ? (
            <SpinnerWithText text={"Loading recorded games..."} />
          ) : (!isLoading && recs.length === 0 && showNoResults) ? (
            <p>No recorded games found!</p>
          ) : null}
        </div>
      </div>
    </Card>
  );
});

// Display name for debugging
GameGallery.displayName = "GameGallery";

export default GameGallery;
