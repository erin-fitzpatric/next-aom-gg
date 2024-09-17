"use client";
import { useEffect, useState } from "react";
import Loading from "../loading";
import { MappedCivStats } from "@/app/api/stats/civs/service";
import EloFilter from "./elo-filter";
import BuildFilter from "./build-filter";
import BarChart from "./bar-chart";

export interface IFilterOptions {
  eloRange: string;
  patch: number | null; // TODO - update this filter to provide a date range associated with a patch.
}

export default function Statistics() {
  const [statisticsData, setStatisticsData] = useState<MappedCivStats | null>(
    null,
  );
  const [builds, setBuilds] = useState([]);
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
    const data = await response.json();
    setBuilds(data);
    if (data.length > 0) {
      setFilterOptions((prev) => ({ ...prev, patch: data[0] })); // Set patch when builds are available
    }
  }

  async function fetchCivStats() {
    const url = `/api/stats/civs?filters=${JSON.stringify(filterOptions)}`;
    const response = await fetch(url);
    const data = await response.json();
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
        <Loading />
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
          <BarChart
            yAxisKey="godName"
            xAxisKey="winRate"
            xAxisFormatter={(value: number) => `${(value * 100).toFixed(1)}%`}
            leftDataKey="totalGames"
            leftDataFormatter={(value: number) => `${value} games`}
            rightDataKey="winRate"
            rightDataFormatter={(value: number) =>
              `${(value * 100).toFixed(1)}% pick rate`
            }
            tooltipFormatter={(value: number) =>
              `Winrate ${(value * 100).toFixed(1)}%`
            }
            title={title}
            data={statisticsData.civStats}
            compareFn={(a, b) => b.winRate - a.winRate}
            totalGamesAnalyzed={statisticsData.totalGamesAnalyzed}
          />
        </>
      )}
    </>
  );
}
