import { Dispatch, SetStateAction, useState } from "react";
import { MajorGodFilter } from "./major-god-filter";
import { MapFilter } from "./map-filter";
import { Filters } from "@/types/Filters";
import RecSearch from "./rec-search";

export default function RecFilters({
  setRecs,
  setIsLoading,
  filters,
  setFilters,
}: {
  setRecs: Dispatch<SetStateAction<any[]>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
}) {
  return (
    <div className="flex space-x-2 justify-end text-primary p-4">
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
    </div>
  );
}
