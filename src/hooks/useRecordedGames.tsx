"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getBuildNumbers,
  getMythRecs,
} from "@/server/controllers/mongo-controller";
import { Filters } from "@/types/Filters";
import { IRecordedGame } from "@/types/RecordedGame";
import { DefaultSession, User } from "next-auth";

// Types for user and session
export interface ExtendedUser extends User {
  userId?: string;
}

export interface ExtendedSession extends DefaultSession {
  userId?: ExtendedUser;
}

// SearchParams interface for better type safety
export interface SearchParamsType {
  get: (key: string) => string | null;
}

// Game state interface with proper typing
interface GameState {
  recs: IRecordedGame[];
  currentPage: number;
  isLoading: boolean;
  hasMore: boolean;
  query: string;
  buildNumbers: number[];
}

// Return type for the hook
interface UseRecordedGamesReturn extends GameState {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  selectedBuild: number | "All Builds" | null;
  setSelectedBuild: React.Dispatch<React.SetStateAction<number | "All Builds" | null>>;
  setRecs: (newRecs: IRecordedGame[] | ((prevRecs: IRecordedGame[]) => IRecordedGame[])) => void;
  setQuery: (newQuery: string | ((prevQuery: string) => string)) => void;
  initialFetch: React.RefObject<boolean>;
}

/**
 * Custom hook for managing recorded games data with infinite scrolling
 *
 * Features:
 * - Fetches and manages recorded game data
 * - Handles filtering and search
 * - Implements infinite scrolling
 * - Manages loading states
 * - Handles URL parameters
 */
export function useRecordedGames(searchParams: SearchParamsType): UseRecordedGamesReturn {
  // Main state for game data and UI state
  const [gameState, setGameState] = useState<GameState>({
    recs: [],
    currentPage: 0,
    isLoading: false,
    hasMore: true,
    query: "",
    buildNumbers: [],
  });

  // Filter state
  const [filters, setFilters] = useState<Filters>({});
  const [selectedBuild, setSelectedBuild] = useState<number | "All Builds" | null>(null);

  // Refs for tracking fetch state
  const initialFetch = useRef(true);
  const isFetchingRef = useRef(false);

  // Memoized state update helper
  const updateGameState = useCallback((
    updates: Partial<GameState> | ((prev: GameState) => GameState)
  ) => {
    if (typeof updates === 'function') {
      setGameState(updates);
    } else {
      setGameState((prev) => ({ ...prev, ...updates }));
    }
  }, []);

  // Fetch recorded games with debounce protection
  const fetchRecs = useCallback(async (
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
        // Clear list on filter change with no results
        if (isFilterChange) {
          updateGameState({ recs: [] });
        }
      } else {
        updateGameState({ hasMore: true });

        if (pageNum === 0) {
          // Replace recs on new filter or initial load
          updateGameState({ recs: mythRecs });
        } else {
          // Append recs for infinite scroll
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
  }, [updateGameState]);

  // Optimized scroll handler with throttling
  const handleScroll = useCallback(() => {
    // Skip if already loading, no more data, or currently fetching
    if (gameState.isLoading || !gameState.hasMore || isFetchingRef.current) {
      return;
    }

    // Calculate scroll position
    const scrollPosition = window.scrollY + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;
    const scrollThreshold = 500; // Load more when within 500px of bottom

    // Load more data when approaching bottom of page
    if (pageHeight - scrollPosition <= scrollThreshold) {
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
    updateGameState,
  ]);

  // Initialize data and set up filters from URL params
  useEffect(() => {
    const initialize = async () => {
      // Set initial loading state
      isFetchingRef.current = true;
      updateGameState({ isLoading: true, recs: [] });

      try {
        // Fetch build numbers first
        const builds = await getBuildNumbers();
        updateGameState({ buildNumbers: builds });

        // Parse URL parameters
        const search = searchParams.get("search");
        const buildNumber = searchParams.get("build");
        let initialFilters: Filters = {};

        // Set up initial filters based on URL params
        if (search && buildNumber) {
          const buildNumInt = parseInt(buildNumber);
          initialFilters = {
            searchQueryString: search,
            buildNumbers: [buildNumInt],
          };
          updateGameState({ query: search });
          setSelectedBuild(buildNumInt);
        } else if (builds.length > 0) {
          // Default to first build if no params
          initialFilters = { buildNumbers: [builds[0]] };
          setSelectedBuild(builds[0]);
        }

        setFilters(initialFilters);

        // Fetch initial data
        await fetchRecs(0, initialFilters, true);
      } catch (error) {
        console.error("Initialization failed:", error);
        updateGameState({ isLoading: false, hasMore: false });
      } finally {
        isFetchingRef.current = false;
        initialFetch.current = false;
      }
    };

    initialize();
  }, [fetchRecs, searchParams, updateGameState]);

  // Handle filter changes after initial load
  useEffect(() => {
    if (initialFetch.current || isFetchingRef.current) {
      return;
    }

    // Reset pagination and fetch with new filters
    updateGameState({ currentPage: 0, hasMore: true });
    fetchRecs(0, filters, true);
  }, [filters, fetchRecs, updateGameState]);

  // Set up scroll listener with cleanup
  useEffect(() => {
    // Use passive listener for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Return all necessary state and functions
  return {
    ...gameState,
    filters,
    setFilters,
    selectedBuild,
    setSelectedBuild,
    setRecs: (newRecs: IRecordedGame[] | ((prevRecs: IRecordedGame[]) => IRecordedGame[])) => {
      if (typeof newRecs === 'function') {
        const updateFn = newRecs as (prevRecs: IRecordedGame[]) => IRecordedGame[];
        updateGameState((prev) => ({ ...prev, recs: updateFn(prev.recs) }));
      } else {
        updateGameState({ recs: newRecs });
      }
    },
    setQuery: (newQuery: string | ((prevQuery: string) => string)) => {
      if (typeof newQuery === 'function') {
        const updateFn = newQuery as (prevQuery: string) => string;
        updateGameState((prev) => ({ ...prev, query: updateFn(prev.query) }));
      } else {
        updateGameState({ query: newQuery });
      }
    },
    initialFetch,
  };
}
