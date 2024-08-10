import { Dispatch, SetStateAction, useState } from "react";
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
}: {
  setRecs: Dispatch<SetStateAction<any[]>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
  buildNumbers: number[];
}) {
  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 justify-end text-primary p-4 w-full">
      <RecSearch
        setRecs={setRecs}
        setIsLoading={setIsLoading}
        filters={filters}
        setFilters={setFilters}
      />
      <MajorGodFilter
        setRecs={setRecs}
        setIsLoading={setIsLoading}
        filters={filters}
        setFilters={setFilters}
      />
      <MapFilter
        setRecs={setRecs}
        setIsLoading={setIsLoading}
        filters={filters}
        setFilters={setFilters}
      />
      <VersionFilter
        setRecs={setRecs}
        setIsLoading={setIsLoading}
        filters={filters}
        setFilters={setFilters}
        buildNumbers={buildNumbers}
      />
    </div>
  );
}
