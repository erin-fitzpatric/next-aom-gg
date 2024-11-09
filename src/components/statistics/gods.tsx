"use client";
import { useEffect, useState } from "react";
import Loading from "../loading";
import { MappedCivStats } from "@/app/api/stats/gods/service";
import { Skeleton } from "../ui/skeleton";
import BarChart from "./bar-chart";
import { Build } from "@/types/Build";
import { Card } from "../ui/card";
import { ALL_ELO_RANGES } from "@/utils/consts";
import EloFilter from "../filters/elo-range-filter";
import DateBuildPatchFilter from "../filters/date-build-patch-filter";

export interface IFilterOptions {
  eloRange?: string;
  patch?: number | null;
  godId?: number | undefined;
}

export default function Gods() {
  const [statisticsData, setStatisticsData] = useState<MappedCivStats | null>(
    null
  );
  const [builds, setBuilds] = useState<Build[]>([]);
  const [filterOptions, setFilterOptions] = useState<IFilterOptions>({
    eloRange: ALL_ELO_RANGES,
    patch: null, // Initialize with null
    godId: undefined, // Initialize with null
  });

  async function fetchBuilds() {
    const url = "/api/builds";
    const response = await fetch(url);
    const data: Build[] = await response.json();
    setBuilds(data);
    if (data.length > 0) {
      setFilterOptions((prev) => ({ ...prev, patch: data[0].buildNumber }));
    }
  }

  function getPatchStartDate(patch: number) {
    const startDate = builds.find(
      (build) => build.buildNumber === patch
    )?.releaseDate;
    return startDate;
  }

  function getPatchEndDate(patch: number) {
    const startIndex = builds.findIndex((build) => build.buildNumber === patch);
    return startIndex > 0 ? builds[startIndex - 1].releaseDate : new Date(); // Set to current date if it's the latest build
  }

  async function fetchCivStats() {
    const startDate = filterOptions.patch
      ? getPatchStartDate(filterOptions.patch)
      : new Date("2024-08-27"); // launch date of the game
    const endDate = filterOptions.patch
      ? getPatchEndDate(filterOptions.patch)
      : new Date(); // current date

    const url = `/api/stats/gods?eloRange=${filterOptions.eloRange}&startDate=${startDate}&endDate=${endDate}`;

    // Fetch the data from the API
    const response = await fetch(url); // Ensure toString() is called on URL
    const data = await response.json();

    // Set the data in state
    setStatisticsData(data);
  }

  // fetch builds first, then fetch civ stats once builds are available
  useEffect(() => {
    fetchBuilds();
  }, []);

  // Only fetch civ stats once builds and patch filterOptions are set
  useEffect(() => {
    if (filterOptions.patch) {
      fetchCivStats();
    }
  }, [filterOptions]);

  return (
    <>
      {!statisticsData ? (
        <div>
          <Skeleton className="h-96">
            <Loading />
          </Skeleton>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:space-x-1 sm:justify-end sm:w-full">
            <EloFilter
              setFilterOptions={setFilterOptions}
              eloFilter={filterOptions.eloRange || ALL_ELO_RANGES}
            />
            <DateBuildPatchFilter
              setFilterOptions={setFilterOptions}
              builds={builds}
              filterOptions={filterOptions}
            />
          </div>
          {/* Win Rate */}
          <Card style={{ minHeight: "600px" }} className="mt-2">
            <BarChart
              yAxisKey="godName"
              xAxisKey="Winrate"
              xAxisFormatter={(value: number) => `${(value * 100).toFixed(1)}%`}
              leftDataKey="totalGames"
              leftDataFormatter={(value: number) => `${value} plays`}
              rightDataKey="Pickrate"
              rightDataFormatter={(value: number) => value}
              tooltipFormatter={(value, name, item) => {
                return `Winrate ${(value * 100).toFixed(1)}%`;
              }}
              title={"Major God Win Rates"}
              data={statisticsData.civStats.map(
                ({ winRate, pickRate, ...civ }) => ({
                  ...civ,
                  Pickrate: pickRate,
                  Winrate: winRate,
                })
              )}
              compareFn={(a, b) => b.Winrate - a.Winrate}
              totalGamesAnalyzed={statisticsData.totalGamesAnalyzed}
            />
          </Card>
          {/* Pick Rate */}
          <Card style={{ minHeight: "600px" }} className="mt-4">
            <BarChart
              yAxisKey="godName"
              // yAxisImage="godImage" // TODO
              xAxisKey="Pickrate"
              xAxisFormatter={(value: number) => `${(value * 100).toFixed(1)}%`}
              leftDataKey="totalGames"
              leftDataFormatter={(value: number) => `${value} plays`}
              rightDataKey="Pickrate"
              rightDataFormatter={(value: number) => value}
              tooltipFormatter={(value, name, item) => {
                return `Pickrate ${(value * 100).toFixed(1)}%`;
              }}
              title={"Major God Pick Rates"}
              data={statisticsData.civStats.map(
                ({ winRate, pickRate, ...civ }) => ({
                  ...civ,
                  Pickrate: pickRate,
                  Winrate: winRate,
                  // GodImage: // TODO
                })
              )}
              compareFn={(a, b) => b.Pickrate - a.Pickrate}
              totalGamesAnalyzed={statisticsData.totalGamesAnalyzed}
            />
          </Card>
        </>
      )}
    </>
  );
}
