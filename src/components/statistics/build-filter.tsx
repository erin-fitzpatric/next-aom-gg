"use client";

import { Dispatch, SetStateAction } from "react";
import { IFilterOptions } from "./gods";
import { Build } from "@/types/Build";

export default function BuildFilter({
  setFilterOptions,
  builds,
  filterOptions,
}: {
  setFilterOptions: Dispatch<SetStateAction<IFilterOptions>>;
  builds: Build[];
  filterOptions: IFilterOptions;
}) {
  return (
    <div className="flex items-center text-primary px-1">
      <select
        id="build-filter"
        className="border border-primary rounded-md p-1"
        value={filterOptions.patch || builds[0]?.buildNumber}
        onChange={(e) =>
          setFilterOptions((prev) => ({
            ...prev,
            patch: parseInt(e.target.value),
          }))
        }
      >
        {builds.map((build) => {
          const buildDate = new Date(build.releaseDate)
            .toISOString()
            .slice(0, 10);
          return (
            <option key={build.buildNumber} value={build.buildNumber}>
              {buildDate} | {build.buildNumber} |{" "}
              {build.description || "Current Live"}
            </option>
          );
        })}
      </select>
    </div>
  );
}
