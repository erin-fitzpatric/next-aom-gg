"use client";
import { useEffect, useState } from "react";
import { MajorGodBarChart } from "./major-gods";
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
    null
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
  const testData = {
        "civStats": [
            {
                "godName": "Poseidon",
                "totalGames": 20574,
                "totalWins": 11535,
                "winRate": 0.9506590842811315,
                "pickRate": 0.0911984255039983
            },
            {
                "godName": "Odin",
                "totalGames": 22719,
                "totalWins": 12451,
                "winRate": 0.5480434878295699,
                "pickRate": 0.10070657281157468
            },
            {
                "godName": "Loki",
                "totalGames": 19166,
                "totalWins": 9915,
                "winRate": 0.517322341646666,
                "pickRate": 0.0849571800918456
            },
            {
                "godName": "Freyr",
                "totalGames": 10615,
                "totalWins": 5470,
                "winRate": 0.51530852567122,
                "pickRate": 0.04705313924005745
            },
            {
                "godName": "Isis",
                "totalGames": 18029,
                "totalWins": 9176,
                "winRate": 0.5089577902268567,
                "pickRate": 0.079917197113424
            },
            {
                "godName": "Kronos",
                "totalGames": 14885,
                "totalWins": 7560,
                "winRate": 0.5078938528720188,
                "pickRate": 0.0659807798010603
            },
            {
                "godName": "Hades",
                "totalGames": 33605,
                "totalWins": 16515,
                "winRate": 0.4914447254872787,
                "pickRate": 0.14896097448536322
            },
            {
                "godName": "Zeus",
                "totalGames": 30670,
                "totalWins": 14725,
                "winRate": 0.48011085751548743,
                "pickRate": 0.13595099203886593
            },
            {
                "godName": "Oranos",
                "totalGames": 7208,
                "totalWins": 3459,
                "winRate": 0.4798834628190899,
                "pickRate": 0.031950921115622616
            },
            {
                "godName": "Set",
                "totalGames": 12572,
                "totalWins": 5945,
                "winRate": 0.4728762328985046,
                "pickRate": 0.0557279384386248
            },
            {
                "godName": "Thor",
                "totalGames": 10600,
                "totalWins": 4900,
                "winRate": 0.46226415094339623,
                "pickRate": 0.04698664869944503
            },
            {
                "godName": "Gaia",
                "totalGames": 14490,
                "totalWins": 6624,
                "winRate": 0.45714285714285713,
                "pickRate": 0.06422986223159985
            },
            {
                "godName": "Ra",
                "totalGames": 10463,
                "totalWins": 4522,
                "winRate": 0.4321896205677148,
                "pickRate": 0.04637936842851824
            }
        ],
        "totalGamesAnalyzed": 225596

}
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
          <BarChart dataKeyLeft="godName" dataKeyRight="winRate" title={title} data={testData.civStats} compareFn={(a, b) => b.winRate - a.winRate} totalGamesAnalyzed={statisticsData.totalGamesAnalyzed}  />
          </>
      )}
    </>
  );
}
