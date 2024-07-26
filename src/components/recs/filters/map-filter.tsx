import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMythRecs } from "@/server/controllers/mongo-controller";
import { FilterProps } from "@/types/Filters";
import { getAllMaps } from "@/types/RandomMap";

export function MapFilter({
  setRecs,
  setIsLoading,
  setFilters,
  filters,
}: FilterProps) {
  async function handleFilterChange(mapKey: string) {
    const mapName = mapKey === "ALL_MAPS" ? [] : [mapKey];
    const updatedFilters = { ...filters, mapNames: mapName };
    setFilters(updatedFilters);
    setIsLoading(true);
    const filteredRecs = await getMythRecs(0, updatedFilters);
    setRecs(filteredRecs);
    setIsLoading(false);
  }

  return (
    <Select onValueChange={(value: string) => handleFilterChange(value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="All Maps" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem key="map-filter-all" value="ALL_MAPS">
            All Maps
          </SelectItem>
          {getAllMaps().map((map) => (
            <SelectItem key={`map-filter-${map.key}`} value={map.key}>
              {map.displayName}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
