"use client";
import { useEffect, useState } from "react";
import { MajorGodBarChart } from "./major-gods";
import Loading from "../loading";
import { MappedCivStats } from "@/app/api/stats/civs/service";
import EloFilter from "./elo-filter";

export default function Statistics() {
  const [statisticsData, setStatisticsData] = useState<MappedCivStats | null>(
    null
  ); // TODO - update this type as we add other stats
  const [title, setTitle] = useState("Major God Win Rates");
  const [eloFilter, setEloFilter] = useState("All");
  const eloBins = [
    "All",
    "0-750",
    "751-1000",
    "1001-1250",
    "1251-1500",
    "1501-1750",
    "1751-2000",
  ];
  // TODO: add a filter state sorted by eloBin

  async function fetchCivStats() {
    const url = `/api/stats/civs?eloRange=${eloFilter}`;
    const response = await fetch(url);
    const data = await response.json();
    setStatisticsData(data);
  }

  // fetch stat data
  useEffect(() => {
    fetchCivStats();
  }, [eloFilter]);

  return (
    <>
      {!statisticsData ? (
        <Loading />
      ) : (
        <>
          <EloFilter
            eloFilter={eloFilter}
            setEloFilter={setEloFilter}
            eloBins={eloBins}
          />
          <MajorGodBarChart data={statisticsData} title={title} />
        </>
      )}
    </>
  );
}
