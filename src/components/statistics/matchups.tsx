"use client";
import { useEffect, useState } from "react";
import Loading from "../loading";
import EloFilter from "./elo-filter";
import { Skeleton } from "../ui/skeleton";
import BuildFilter from "./build-filter";
import { Build } from "@/types/Build";
import { Card } from "../ui/card";
import { MajorGods } from "@/types/MajorGods";
import { getMatchupData } from "@/server/controllers/stats/matchups";
import { MatchupStats } from "@/types/CivStats";
import BarChart from "./bar-chart";
import { MajorGodFilter } from "./major-god-filter";

export interface IFilterOptions {
  eloRange: string;
  patch: number | null;
  godId: number | null;
}

export default function Matchups() {
  const [statisticsData, setStatisticsData] = useState<MatchupStats | null>(
    null
  );
  const [builds, setBuilds] = useState<Build[]>([]);
  const [filterOptions, setFilterOptions] = useState<IFilterOptions>({
    eloRange: "All",
    patch: null, // Initialize with null
    godId: MajorGods.Zeus, // Initialize with Zeus
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

  // fetch builds first, then fetch civ stats once builds are available
  useEffect(() => {
    fetchBuilds();
  }, []);

  // Only fetch civ stats once builds and patch filterOptions are set
  useEffect(() => {
    function getPatchStartDate(patch: number) {
      const startDate = builds.find(
        (build) => build.buildNumber === patch
      )?.releaseDate;
      return startDate ? new Date(startDate).toISOString() : undefined; // Ensure it's an ISO string
    }

    function getPatchEndDate(patch: number) {
      const startIndex = builds.findIndex(
        (build) => build.buildNumber === patch
      );
      const result =
        startIndex > 0 ? builds[startIndex - 1].releaseDate : new Date(); // Set to current date if it's the latest build
      return new Date(result).toISOString(); // Ensure the result is in ISO string format
    }

    async function fetchMatchupStats() {
      const startDate = filterOptions.patch
        ? getPatchStartDate(filterOptions.patch)
        : new Date("2024-08-27").toISOString(); // launch date of the game
      const endDate = filterOptions.patch
        ? getPatchEndDate(filterOptions.patch)
        : new Date().toISOString(); // current date

      // Fetch the data from the API
      const response = await getMatchupData({
        eloRange: filterOptions.eloRange,
        startDate,
        endDate,
        godId: MajorGods.Zeus, // TODO - use filter for this value
      });

      // Set the data in state
      setStatisticsData(response);
    }
    if (filterOptions.patch) {
      fetchMatchupStats();
    }
  }, [filterOptions, builds]);

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
            <MajorGodFilter
              selectedGod={filterOptions.godId}
              setFilterOptions={setFilterOptions}
            />
          </div>
          {/* Win Rate */}
          <Card style={{ minHeight: "600px" }}>
            <BarChart
              title="Matchups"
              data={Object.entries(statisticsData)
                .map(([godName, godStats]) => {
                  return {
                    godName,
                    winRate: (
                      (godStats.totalWins / godStats.totalResults) *
                      100
                    ).toFixed(1),
                    totalResults: godStats.totalResults,
                  };
                }, 0)
                .sort((a, b) => parseFloat(b.winRate) - parseFloat(a.winRate))}
              xAxisKey="winRate"
              yAxisKey="godName"
              leftDataKey="totalResults"
              leftDataFormatter={(value) => `${value} games`}
              xAxisFormatter={(value) => `${value}%`}
              tooltipFormatter={(value) => `${value}%`}
            />
          </Card>
        </>
      )}
    </>
  );
}
