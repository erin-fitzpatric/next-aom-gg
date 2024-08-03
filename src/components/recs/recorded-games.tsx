"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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

export default function RecordedGames() {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState(true);
  const [recs, setRecs] = useState<any[]>([]);

  const [filters, setFilters] = useState<Filters>({});
  const [buildNumbers, setBuildNumbers] = useState<number[]>([]);
  const initialFetch = useRef(true);

  const fetchRecs = useCallback(async (pageNum: number, filters?: Filters) => {
    let mappedFilters = filters;
    if (initialFetch.current) {
      const builds = await getBuildNumbers();
      setBuildNumbers(builds);
      mappedFilters = { buildNumbers: [builds[0]] }; // filter by latest build on load
      setFilters(mappedFilters);
    }
    const mythRecs = await getMythRecs(pageNum, mappedFilters);

    if (mythRecs.length === 0) {
      setHasMore(false);
      setIsLoading(false);
      return;
    }

    setRecs((prevRecs) => [...prevRecs, ...mythRecs]);
    setIsLoading(false);
  }, []);

  const handleScroll = useCallback(() => {
    if (isLoading || !hasMore) return;
    const scrollPosition = window.scrollY + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;
    if (pageHeight - scrollPosition <= 300) {
      setIsLoading(true);
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchRecs(nextPage, filters);
    }
  }, [isLoading, hasMore, currentPage, fetchRecs, filters]);

  useEffect(() => {
    if (initialFetch.current) {
      fetchRecs(0, { buildNumbers: [-1] });
      initialFetch.current = false;
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchRecs, handleScroll]);

  // Reenable infinite scroll when filters change
  useEffect(() => {
    setHasMore(true);
    setCurrentPage(0);
  }, [filters]);

  return initialFetch.current ? (
    <Loading />
  ) : (
    <div className="relative">
      <div className="card-header">
        <h2>Recorded Games</h2>
      </div>
      {/* filters */}
      <div className="flex flex-row-reverse">
        <RecFilters
          setRecs={setRecs}
          setIsLoading={setIsLoading}
          filters={filters}
          setFilters={setFilters}
          buildNumbers={buildNumbers}
        />
      </div>

      {recs.length === 0 && !initialFetch.current ? (
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
                    ></RecTile>
                  </div>
                </Card>
              ))}
            </div>
            {isLoading && (
              <div className="flex justify-center mt-4">
                <SpinnerWithText text={"Loading recorded games..."} />
              </div>
            )}
          </div>
        </Card>
      )}
      <div className="fixed bottom-4 right-4 mr-2">
        <RecUploadForm setRecs={setRecs} />
      </div>
    </div>
  );
}
