"use client";

import { Dispatch, SetStateAction } from "react";
import { Build } from "@/types/Build";
import { SelectFilter } from "./select-filter";
import { IFilterOptions } from "../statistics/gods";

export default function DateBuildPatchFilter({
  setFilterOptions,
  builds,
  filterOptions,
}: {
  setFilterOptions: Dispatch<SetStateAction<IFilterOptions>>;
  builds: Build[];
  filterOptions: IFilterOptions;
}) {
  function getValue(build: Build) {
    return build.buildNumber.toString();
  }

  return (
    <SelectFilter
      data={builds}
      selectedValue={filterOptions.patch?.toString() || builds[0]?.buildNumber.toString()} // Ensure value is a string
      setSelectedValue={(value: string) => {
        setFilterOptions((prev: any) => ({
          ...prev,
          patch: parseInt(value), // Convert back to number for filterOptions
        }));
      }}
      getLabel={(build) => {
        const buildDate = new Date(build.releaseDate).toISOString().slice(0, 10);
        return `${buildDate} | ${build.buildNumber} | ${build.description || "Current Live"}`;
      }}
      getValue={getValue} // Make sure getValue is passed as a function
      placeholder="Select a Build"
    />
  );
}
