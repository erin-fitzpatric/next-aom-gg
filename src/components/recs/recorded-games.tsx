"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SpinnerWithText } from "../spinner";
import { Card } from "../ui/card";
import RecTile from "./rec-tile";
import {
  getBuildNumbers,
  getMythRecs,
} from "@/server/controllers/mongo-controller";
import RecFilters from "./filters/rec-filters";
import { Filters } from "@/types/Filters";
import Loading from "../loading";
import RecUploadForm from "./rec-upload-form";
import { useSearchParams } from "next/navigation";
import { DefaultSession, User } from "next-auth";

export interface ExtendedUser extends User {
  userId?: string;
}

export interface ExtendedSession extends DefaultSession {
  userId?: ExtendedUser;
}

export default function RecordedGames() {
  // Set state
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Still used for loading indicator
  const [hasMore, setHasMore] = useState(true);
  const [recs, setRecs] = useState<any[]>([]);
  const [query, setQuery] = useState<string>("");
  const [filters, setFilters] = useState<Filters>({});
  const [buildNumbers, setBuildNumbers] = useState<number[]>([]);
  // TODO - This can probably be refactored to be part of the filters state
  const [selectedBuild, setSelectedBuild] = useState<
    number | "All Builds" | null
  >(null);
  const initialFetch = useRef(true);
  const isFetchingRef = useRef(false); // Ref to prevent concurrent fetches
  const searchParams = useSearchParams();

  const fetchRecs = useCallback(
    async (
      pageNum: number,
      currentFilters: Filters,
      isFilterChange = false,
    ) => {
      // Prevent concurrent fetches
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      setIsLoading(true); // Show loading indicator

      try {
        const mythRecs = await getMythRecs(pageNum, currentFilters);

        if (mythRecs.length === 0) {
          setHasMore(false);
          // If it was a filter change and no results, clear the list.
          if (isFilterChange) {
            setRecs([]);
          }
        } else {
          setHasMore(true); // Always assume more if results are returned
          if (pageNum === 0) {
            // New filter applied or initial load, replace recs
            setRecs(mythRecs);
          } else {
            // Infinite scroll, append recs
            setRecs((prevRecs) => [...prevRecs, ...mythRecs]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch recs:", error);
        // Optionally handle error state, e.g., show a message
        setHasMore(false); // Stop further loading on error
      } finally {
        setIsLoading(false); // Hide loading indicator
        isFetchingRef.current = false; // Allow next fetch
      }
    },
    [], // Keep dependencies minimal, functions like getMythRecs are stable imports
  );

  const handleScroll = useCallback(() => {
    if (isLoading || !hasMore || isFetchingRef.current) return;
    const scrollPosition = window.scrollY + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;
    if (pageHeight - scrollPosition <= 500) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchRecs(nextPage, filters); // Fetch next page with current filters
    }
  }, [isLoading, hasMore, currentPage, fetchRecs, filters]);

  // Effect for initial load
  useEffect(() => {
    // This runs only once on mount
    const initialize = async () => {
      isFetchingRef.current = true; // Prevent other fetches during init
      setIsLoading(true);
      try {
        const builds = await getBuildNumbers();
        setBuildNumbers(builds);

        const search = searchParams.get("search");
        const buildNumber = searchParams.get("build");
        let initialFilters: Filters = {};

        if (search && buildNumber) {
          const buildNumInt = parseInt(buildNumber);
          initialFilters = {
            searchQueryString: search,
            buildNumbers: [buildNumInt],
          };
          setQuery(search);
          setSelectedBuild(buildNumInt);
        } else if (builds.length > 0) {
          initialFilters = { buildNumbers: [builds[0]] }; // Default to latest build
          setSelectedBuild(builds[0]); // Reflect default in state
        }

        setFilters(initialFilters); // Set initial filters state *once*
        await fetchRecs(0, initialFilters, true); // Fetch initial data (page 0)
      } catch (error) {
        console.error("Initialization failed:", error);
        setIsLoading(false); // Ensure loading stops on error
        setHasMore(false);
      } finally {
        initialFetch.current = false; // Mark initialization complete
        isFetchingRef.current = false; // Allow fetches now
      }
    };

    initialize();
  }, [fetchRecs, searchParams]); // Add dependencies

  // Effect for handling filter changes *after* initial load
  useEffect(() => {
    // Skip if it's the initial render/load phase
    if (initialFetch.current || isFetchingRef.current) {
      return;
    }

    // Filters have changed, reset pagination and fetch page 0
    setCurrentPage(0);
    setHasMore(true); // Assume new filters might have results
    fetchRecs(0, filters, true); // Fetch page 0 with the new filters, mark as filter change
  }, [filters, fetchRecs]); // Depend on filters and fetchRecs

  // Effect for infinite scroll setup
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]); // Only depend on handleScroll

  // Render Loading component only during the absolute initial fetch
  if (initialFetch.current && isLoading) {
    return <Loading />;
  }

  return (
    <div className="relative">
      {/* filters */}
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
        <Card className="p-4 w-full bg-secondary flex flex-col items-center justify-center">
          <div className="card-header">
            <p className="text-gold text-center">How to Watch Recorded Games</p>
          </div>
          <p className="text-center">
            Download the .rec file - place in your game directory:
            <code className="pl-2 text-gold italic break-all">
              C:\Users\YourUser\Games\Age of Mythology
              Retold\yourSteamId\replays
            </code>
            {" - "}launch the game - select {`'Replays'`} in the main menu -
            enjoy!
          </p>
          <p className="flex font-semibold underline italic flex-wrap text-center text-primary">
            Replays only work on the patch they were recorded on.
          </p>
        </Card>
      </div>

      {/* Conditional Rendering: No results message vs. Gallery */}
      {!isLoading && recs.length === 0 ? (
        <div className="flex justify-center mt-4">
          <Card className="p-4 w-full">
            <p className="flex justify-center">No recorded games found!</p>
          </Card>
        </div>
      ) : (
        <Card className="p-4">
          {/* Replay Gallery */}
          <div>
            <div className="flex flex-row flex-wrap justify-center">
              {recs?.map((rec) => (
                <Card
                  key={rec.gameGuid}
                  className="bg-secondary rounded-lg m-1 p-2 flex w-fit"
                >
                  <div>
                    <RecTile
                      key={`rec-tile-${rec.gameGuid}`}
                      rec={rec}
                      setRecs={setRecs}
                    />
                  </div>
                </Card>
              ))}
            </div>
            {/* Loading indicator at the bottom for pagination/filter updates */}
            {isLoading && (
              <div className="flex justify-center mt-4">
                <SpinnerWithText text={"Loading recorded games..."} />
              </div>
            )}
          </div>
        </Card>
      )}
      <div className="fixed bottom-4 right-4 mr-2">
        {/* Pass filters here if upload needs to know current filters */}
        <RecUploadForm setRecs={setRecs} filters={filters} />
      </div>
    </div>
  );
}
