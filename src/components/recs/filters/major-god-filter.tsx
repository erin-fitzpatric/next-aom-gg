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
    setRecs([]);
    const filteredRecs = await getMythRecs(0, updatedFilters);
    setRecs(filteredRecs);
    setIsLoading(false);
  }

  return (
    <select
      className="w-full sm:w-[180px] border border-gray-300 rounded-md p-2"
      onChange={(e) => handleFilterChange(e.target.value)}
      defaultValue="ALL_GODS"
    >
      <option value="ALL_GODS">All Gods</option>
      {listMajorGods().map((god) => (
        <option key={`filter-${god.name}`} value={god.name}>
          {god.name}
        </option>
      ))}
    </select>
  );
}
