import { FilterProps } from "@/types/Filters";
import { getAllMaps } from "@/types/RandomMap";

export function MapFilter({
  setFilters,
  filters,
}: {
  setFilters: FilterProps["setFilters"];
  filters: FilterProps["filters"];
}) {
  async function handleFilterChange(mapKey: string) {
    const mapName = mapKey === "ALL_MAPS" ? [] : [mapKey];
    const updatedFilters = { ...filters, mapNames: mapName };
    setFilters(updatedFilters);
  }

  return (
    <select
      className="w-full sm:w-[180px] lg:w-[220px] border border-gray-300 rounded-md p-2"
      onChange={(e) => handleFilterChange(e.target.value)}
      defaultValue="ALL_MAPS"
    >
      <option value="ALL_MAPS">All Maps</option>
      {getAllMaps().map((map) => (
        <option key={`map-filter-${map.key}`} value={map.key}>
          {map.displayName}
        </option>
      ))}
    </select>
  );
}
