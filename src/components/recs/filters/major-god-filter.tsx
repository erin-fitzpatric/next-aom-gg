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
import { listMajorGods, MajorGods } from "@/types/MajorGods";

export function MajorGodFilter({
  setRecs,
  setIsLoading,
  setFilters,
  filters,
}: FilterProps) {
  async function handleFilterChange(value: string) {
    const godName =
      value === "ALL_GODS" ? [] : [MajorGods[value as keyof typeof MajorGods]];
    const updatedFilters = { ...filters, godIds: godName };
    setFilters(updatedFilters);
    setIsLoading(true);
    const filteredRecs = await getMythRecs(0, updatedFilters);
    setRecs(filteredRecs);
    setIsLoading(false);
  }

  return (
    <Select onValueChange={(value: string) => handleFilterChange(value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="All Gods" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem key="map-filter-all" value="ALL_GODS">
            All Gods
          </SelectItem>
          {listMajorGods().map((god) => (
            <SelectItem key={`filter-${god.name}`} value={god.name}>
              {god.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
