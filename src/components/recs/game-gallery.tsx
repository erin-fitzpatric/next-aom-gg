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
 * GameGallery - Displays a grid of recorded game tiles with smooth loading transitions
 *
 * Features:
 * - Smooth fade-in animations when loading new content
 * - Delayed "No results" message to prevent flickering
 * - Loading indicators
 * - Responsive grid layout
 */
export const GameGallery = memo(({ recs, isLoading, setRecs }: GameGalleryProps) => {
  // State for UI transitions and animations
  const [showNoResults, setShowNoResults] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  // Refs to track previous state for comparison
  const prevLoadingState = useRef(isLoading);
  const prevRecsLength = useRef(recs.length);

  // Handle fade animation when loading state or results change
  useEffect(() => {
    // Hide content during loading
    if (recs.length > 0 && isLoading) {
      setFadeIn(false);
    }

    // Fade in content when loaded
    if (recs.length > 0 && !isLoading) {
      const timer = setTimeout(() => {
        setFadeIn(true);
      }, 100); // Short delay for smoother transition
      return () => clearTimeout(timer);
    }

    // Update refs for next comparison
    prevLoadingState.current = isLoading;
    prevRecsLength.current = recs.length;
  }, [isLoading, recs.length]);

  // Handle "No results" message with delay to prevent flickering
  useEffect(() => {
    // Reset no results state when loading or when we have results
    if (isLoading || recs.length > 0) {
      setShowNoResults(false);
      return;
    }

    // Show "No results" message after a delay
    const timer = setTimeout(() => {
      if (!isLoading && recs.length === 0) {
        setShowNoResults(true);
      }
    }, 500);

    return () => clearTimeout(timer);
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

  // Show "No recorded games found!" message
  if (!isLoading && recs.length === 0 && showNoResults) {
    return (
      <div className="flex justify-center mt-4">
        <Card className="p-4 w-full">
          <p className="flex justify-center">No recorded games found!</p>
        </Card>
      </div>
    );
  }

  // Show loading spinner when initially loading
  if (isLoading && recs.length === 0) {
    return (
      <Card className="p-4">
        <div className="flex justify-center mt-4">
          <SpinnerWithText text={"Loading recorded games..."} />
        </div>
      </Card>
    );
  }

  // Main gallery view with fade-in animation
  return (
    <Card className="p-4">
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          fadeIn ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="flex flex-row flex-wrap justify-center gap-2">
          {recs?.map(renderGameTile)}
        </div>

        {/* Loading indicator for infinite scroll or filtering */}
        {isLoading && (
          <div className="flex justify-center mt-4">
            <SpinnerWithText text={"Loading recorded games..."} />
          </div>
        )}
      </div>
    </Card>
  );
});

// Display name for debugging
GameGallery.displayName = "GameGallery";

export default GameGallery;
