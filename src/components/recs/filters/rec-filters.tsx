import { MajorGodFilter } from "./major-god-filter";
import { MapFilter } from "./map-filter";
import { FilterProps } from "@/types/Filters";
import RecSearch from "./rec-search";
import { VersionFilter } from "./version-filter";

export default function RecFilters({
  filters,
  setFilters,
  buildNumbers,
  query,
  setQuery,
  selectedBuild,
  setSelectedBuild,
}: FilterProps) {
  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 justify-end text-primary py-2 bg-pm w-full">
      <RecSearch
        setFilters={setFilters}
        query={query || ""}
        setQuery={setQuery}
      />

      <MajorGodFilter filters={filters} setFilters={setFilters} />
      <MapFilter filters={filters} setFilters={setFilters} />
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
}
