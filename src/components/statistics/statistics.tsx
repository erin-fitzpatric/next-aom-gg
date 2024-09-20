"use client";
import { useEffect, useState } from "react";
import Loading from "../loading";
import { MappedCivStats } from "@/app/api/stats/civs/service";
import EloFilter from "./elo-filter";
import { Skeleton } from "../ui/skeleton";
import BuildFilter from "./build-filter";
import BarChart from "./bar-chart";
import { Build } from "@/types/Build";
import { HardHat } from "lucide-react";
import { Card } from "../ui/card";

export interface IFilterOptions {
  eloRange: string;
  patch: number | null;
}

export default function Statistics() {
  const [statisticsData, setStatisticsData] = useState<MappedCivStats | null>(
    null
  );
  const [builds, setBuilds] = useState<Build[]>([]);
  const [title, setTitle] = useState("Major God Win Rates");
  const [filterOptions, setFilterOptions] = useState<IFilterOptions>({
    eloRange: "All",
    patch: null, // Initialize with null
  });
  const eloBins = [
    "All",
    "0-750",
    "751-1000",
    "1001-1250",
    "1251-1500",
    "1501-1750",
    "1751-2000",
  ];

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
    console.log(patch);
    const startDate = builds.find(
      (build) => build.buildNumber === patch
    )?.releaseDate;
    console.log("startDate", startDate);
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

    const url = `/api/stats/civs?eloRange=${filterOptions.eloRange}&startDate=${startDate}&endDate=${endDate}`;

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
          <div className="flex flex-row-reverse flex-wrap pb-4">
            <EloFilter
              eloFilter={filterOptions.eloRange}
              setFilterOptions={setFilterOptions}
              eloBins={eloBins}
            />
            <BuildFilter
              builds={builds}
              setFilterOptions={setFilterOptions}
              filterOptions={filterOptions}
            />
          </div>
          <Card className="p-4 mb-4 flex">
            <div className="text-primary flex font-semibold mx-auto">
              <HardHat className="text-gold mr-2"></HardHat>Page under construction -please use a desktop browser for best viewing experience! <HardHat className="text-gold ml-2"></HardHat>
            </div>
          </Card>
          <BarChart
            yAxisKey="godName"
            xAxisKey="Winrate"
            xAxisFormatter={(value: number) => `${(value * 100).toFixed(1)}%`}
            leftDataKey="totalGames"
            leftDataFormatter={(value: number) => `${value} games`}
            rightDataKey="Pickrate"
            rightDataFormatter={(value: number) =>
              value
            }
            tooltipFormatter={(value, name, item) => {
              if (name === "Winrate") {
                return `Winrate ${(value * 100).toFixed(1)}%`;
              }
              if (name === "Pickrate") {
                return `Pickrate ${(value * 100).toFixed(1)}%`;
              }
              return value;
            }}
            title={title}
            data={statisticsData.civStats.map(({winRate, pickRate, ...civ}) => ({
              ...civ,
              Pickrate: pickRate,
              Winrate: winRate,
            }))}
            compareFn={(a, b) => b.Winrate - a.Winrate}
            totalGamesAnalyzed={statisticsData.totalGamesAnalyzed}
          />
        </>
      )}
    </>
  );
}
