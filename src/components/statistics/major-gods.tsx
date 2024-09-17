"use client";

import BarChart from "@/components/statistics/bar-chart";
import { MappedCivStats } from "@/app/api/stats/civs/service";

export const description = "A bar chart with dynamic font size labels";


export function MajorGodBarChart({
  data,
  title,
}: {
  data: MappedCivStats;
  title: string;
}) {
  return (
    <BarChart title={title} data={data.civStats} compareFn={(a, b) => b.winRate - a.winRate} totalGamesAnalyzed={data.totalGamesAnalyzed}  />
  );
}
