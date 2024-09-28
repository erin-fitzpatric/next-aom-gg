import { FilterProps } from "@/types/Filters";
import { listMajorGods, MajorGods } from "@/types/MajorGods";

export function MajorGodFilter({
  setFilters,
  filters,
}: {
  setFilters: FilterProps["setFilters"];
  filters: FilterProps["filters"];
}) {
  async function handleFilterChange(value: string) {
    const godName =
      value === "ALL_GODS" ? [] : [MajorGods[value as keyof typeof MajorGods]];
    const updatedFilters = { ...filters, godIds: godName };
    setFilters(updatedFilters);
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
