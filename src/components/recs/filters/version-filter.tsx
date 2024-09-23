"use client";

import { getMythRecs } from "@/server/controllers/mongo-controller";
import { FilterProps } from "@/types/Filters";
import { useEffect } from "react";

export function VersionFilter({
  setRecs,
  setIsLoading,
  setFilters,
  filters,
  buildNumbers,
  selectedBuild,
  setSelectedBuild,
}: FilterProps) {
  useEffect(() => {
    if (buildNumbers && buildNumbers.length > 0 && selectedBuild === null) {
      setSelectedBuild(buildNumbers[1]);
    }
  }, [buildNumbers, selectedBuild, setSelectedBuild]);

  async function handleFilterChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    const buildString = event.target.value;
    const isAllBuilds = buildString === "ALL_BUILDS";
    const buildFilter = isAllBuilds ? [] : [parseInt(buildString)];
    const buildNum = isAllBuilds ? null : parseInt(buildString);
    const updatedFilters = {
      ...filters,
      buildNumbers: buildFilter,
    };
    setFilters(updatedFilters);
    setIsLoading(true);
    const filteredRecs = await getMythRecs(0, updatedFilters);
    setRecs(filteredRecs);
    setIsLoading(false);
    setSelectedBuild(buildNum);
  }

  return (
    buildNumbers &&
    buildNumbers.length > 0 && (
      <select
        className="w-full sm:w-[180px] border border-gray-300 rounded-md p-2"
        value={selectedBuild?.toString() || "ALL_BUILDS"}
        onChange={handleFilterChange}
      >
        <option value="ALL_BUILDS">All Builds</option>
        {buildNumbers.map((build) => (
          <option key={`build-filter-${build}`} value={build.toString()}>
            {build}
          </option>
        ))}
      </select>
    )
  );
}
