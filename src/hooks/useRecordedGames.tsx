"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getBuildNumbers,
  getMythRecs,
} from "@/server/controllers/mongo-controller";
import { Filters } from "@/types/Filters";
import { useSearchParams } from "next/navigation";
import { DefaultSession, User } from "next-auth";

// Types for user and session
export interface ExtendedUser extends User {
  userId?: string;
}

export interface ExtendedSession extends DefaultSession {
  userId?: ExtendedUser;
}

// Custom hook for managing recorded games data
export function useRecordedGames(searchParams) {
  const [gameState, setGameState] = useState({
    recs: [],
    currentPage: 0,
    isLoading: false,
    hasMore: true,
    query: "",
    buildNumbers: [],
  });

  // Consolidated filters state, including selectedBuild
  const [filters, setFilters] = useState<Filters>({});
  const [selectedBuild, setSelectedBuild] = useState<
    number | "All Builds" | null
  >(null);

  const initialFetch = useRef(true);
  const isFetchingRef = useRef(false);

  // Update game state helper
  const updateGameState = (updates) => {
    setGameState((prev) => ({ ...prev, ...updates }));
  };

  // Fetch recorded games data
  const fetchRecs = useCallback(
    async (
      pageNum: number,
      currentFilters: Filters,
      isFilterChange = false,
    ) => {
      // Prevent concurrent fetches
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      updateGameState({ isLoading: true });

      try {
        const mythRecs = await getMythRecs(pageNum, currentFilters);

        if (mythRecs.length === 0) {
          updateGameState({ hasMore: false });
          // If it was a filter change and no results, clear the list
          if (isFilterChange) {
            updateGameState({ recs: [] });
          }
        } else {
          updateGameState({ hasMore: true });

          if (pageNum === 0) {
            // New filter applied or initial load, replace recs
            updateGameState({ recs: mythRecs });
          } else {
            // Infinite scroll, append recs
            updateGameState((prev) => ({
              ...prev,
              recs: [...prev.recs, ...mythRecs],
            }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch recs:", error);
        updateGameState({ hasMore: false });
      } finally {
        updateGameState({ isLoading: false });
        isFetchingRef.current = false;
      }
    },
    [],
  );

  // Handle infinite scrolling
  const handleScroll = useCallback(() => {
    if (gameState.isLoading || !gameState.hasMore || isFetchingRef.current)
      return;

    const scrollPosition = window.scrollY + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;

    if (pageHeight - scrollPosition <= 500) {
      const nextPage = gameState.currentPage + 1;
      updateGameState({ currentPage: nextPage });
      fetchRecs(nextPage, filters);
    }
  }, [
    gameState.isLoading,
    gameState.hasMore,
    gameState.currentPage,
    fetchRecs,
    filters,
  ]);

  // Initialize data and set up filters
  useEffect(() => {
    const initialize = async () => {
      isFetchingRef.current = true;
      updateGameState({ isLoading: true });

      try {
        const builds = await getBuildNumbers();
        updateGameState({ buildNumbers: builds });

        const search = searchParams.get("search");
        const buildNumber = searchParams.get("build");
        let initialFilters: Filters = {};

        if (search && buildNumber) {
          const buildNumInt = parseInt(buildNumber);
          initialFilters = {
            searchQueryString: search,
            buildNumbers: [buildNumInt],
          };
          updateGameState({ query: search });
          setSelectedBuild(buildNumInt);
        } else if (builds.length > 0) {
          initialFilters = { buildNumbers: [builds[0]] };
          setSelectedBuild(builds[0]);
        }

        setFilters(initialFilters);
        await fetchRecs(0, initialFilters, true);
      } catch (error) {
        console.error("Initialization failed:", error);
        updateGameState({ isLoading: false, hasMore: false });
      } finally {
        initialFetch.current = false;
        isFetchingRef.current = false;
      }
    };

    initialize();
  }, [fetchRecs, searchParams]);

  // Handle filter changes after initial load
  useEffect(() => {
    if (initialFetch.current || isFetchingRef.current) {
      return;
    }

    updateGameState({ currentPage: 0, hasMore: true });
    fetchRecs(0, filters, true);
  }, [filters, fetchRecs]);

  // Set up scroll listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return {
    ...gameState,
    filters,
    setFilters,
    selectedBuild,
    setSelectedBuild,
    setRecs: (newRecs) => updateGameState({ recs: newRecs }),
    setQuery: (newQuery) => updateGameState({ query: newQuery }),
    initialFetch,
  };
}
