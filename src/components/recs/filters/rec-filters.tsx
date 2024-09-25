import { Dispatch, SetStateAction } from "react";
import { MajorGodFilter } from "./major-god-filter";
import { MapFilter } from "./map-filter";
import { Filters } from "@/types/Filters";
import RecSearch from "./rec-search";
import { VersionFilter } from "./version-filter";

export default function RecFilters({
  setRecs,
  setIsLoading,
  filters,
  setFilters,
  buildNumbers,
  query,
  setQuery,
  selectedBuild,
  setSelectedBuild,
}: {
  setRecs: Dispatch<SetStateAction<any[]>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
  buildNumbers: number[];
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  selectedBuild: number | null;
  setSelectedBuild: Dispatch<SetStateAction<number | null>>;
}) {
  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 justify-end text-primary py-2 bg-pm w-full">
      <RecSearch
        setRecs={setRecs}
        setIsLoading={setIsLoading}
        filters={filters}
        setFilters={setFilters}
        query={query|| ""}
        setQuery={setQuery}
        selectedBuild={selectedBuild}
        setSelectedBuild={setSelectedBuild}
      />
      <MajorGodFilter
        setRecs={setRecs}
        setIsLoading={setIsLoading}
        filters={filters}
        setFilters={setFilters}
        query={query || ""}
        setQuery={setQuery}
        selectedBuild={selectedBuild}
        setSelectedBuild={setSelectedBuild}
      />
      <MapFilter
        setRecs={setRecs}
        setIsLoading={setIsLoading}
        filters={filters}
        setFilters={setFilters}
        query={query || ""}
        setQuery={setQuery}
        selectedBuild={selectedBuild}
        setSelectedBuild={setSelectedBuild}
      />
      <VersionFilter
        setRecs={setRecs}
        setIsLoading={setIsLoading}
        filters={filters}
        setFilters={setFilters}
        buildNumbers={buildNumbers}
        query={query || ""}
        setQuery={setQuery}
        selectedBuild={selectedBuild}
        setSelectedBuild={setSelectedBuild}
      />
    </div>
  );
}
