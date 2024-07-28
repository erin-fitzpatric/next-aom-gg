"use client";

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
import { useEffect, useState } from "react";

export function VersionFilter({
  setRecs,
  setIsLoading,
  setFilters,
  filters,
  buildNumbers,
}: FilterProps) {
  const [selectedBuild, setSelectedBuild] = useState<number | null>(null);

  useEffect(() => {
    if (buildNumbers && buildNumbers.length > 0) {
      setSelectedBuild(buildNumbers[0]);
    }
  }, [buildNumbers]);

  async function handleFilterChange(buildString: string) {
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
      <Select
        value={selectedBuild?.toString() || "ALL_BUILDS"}
        onValueChange={(value: string) => handleFilterChange(value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue>
            {selectedBuild !== null ? selectedBuild.toString() : "All Builds"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem key="builds-filter-all" value="ALL_BUILDS">
              All Builds
            </SelectItem>
            {buildNumbers.map((build) => (
              <SelectItem key={`build-filter-${build}`} value={build.toString()}>
                {build}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  );
}
