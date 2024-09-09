"use client";
import { BarChartHorizontal } from "@/components/bar-chart-horizontal";
import { useState } from "react";

export default function Statistics() {
  const [statisticsData, setStatisticsData] = useState<any[]>([]);

  return (
    <>
      <BarChartHorizontal />
    </>
  );
}
