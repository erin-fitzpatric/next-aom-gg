"use client";

import { FilterProps } from "@/types/Filters";
import React, { useEffect } from "react";

export function VersionFilter({
  setFilters,
  filters,
  buildNumbers,
  selectedBuild,
  setSelectedBuild,
}: FilterProps) {
  useEffect(() => {
    if (buildNumbers && buildNumbers.length > 0 && selectedBuild === null) {
      setSelectedBuild(buildNumbers[0]);
    }
  }, [buildNumbers, selectedBuild, setSelectedBuild]);

  async function handleFilterChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    const buildString = event.target.value;
    const isAllBuilds = buildString === "ALL_BUILDS";
    const buildFilter = isAllBuilds ? [] : [parseInt(buildString)];
    const buildNum = isAllBuilds ? "All Builds" : parseInt(buildString);
    const updatedFilters = {
      ...filters,
      buildNumbers: buildFilter,
    };
    setFilters(updatedFilters);
    setSelectedBuild(buildNum);
  }

  return (
    buildNumbers &&
    buildNumbers.length > 0 && (
      <select
        className="w-full sm:w-[180px] lg:w-[220px] border border-gray-300 rounded-md p-2"
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
