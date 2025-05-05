import { memo } from "react";
import { FilterProps } from "@/types/Filters";

// Filter components
import { MajorGodFilter } from "./major-god-filter";
import { MapFilter } from "./map-filter";
import RecSearch from "./rec-search";
import { VersionFilter } from "./version-filter";

/**
 * RecFilters - Component for filtering recorded games
 *
 * This component combines multiple filter controls:
 * - Search by text
 * - Filter by major god
 * - Filter by map
 * - Filter by game version/build
 */
const RecFilters = memo(({
  filters,
  setFilters,
  buildNumbers,
  query,
  setQuery,
  selectedBuild,
  setSelectedBuild,
}: FilterProps) => {
  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 justify-end text-primary py-2 bg-pm w-full">
      {/* Text search filter */}
      <RecSearch
        setFilters={setFilters}
        query={query || ""}
        setQuery={setQuery}
      />

      {/* God selection filter */}
      <MajorGodFilter
        filters={filters}
        setFilters={setFilters}
      />

      {/* Map selection filter */}
      <MapFilter
        filters={filters}
        setFilters={setFilters}
      />

      {/* Game version/build filter */}
      <VersionFilter
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
});

// Display name for debugging
RecFilters.displayName = "RecFilters";

export default RecFilters;
