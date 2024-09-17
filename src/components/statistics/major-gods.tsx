"use client";

import { useEffect, useState, useRef } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { MappedCivStats } from "@/app/api/stats/civs/service";

export const description = "A bar chart with dynamic font size labels";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

export function MajorGodBarChart({
  data,
  title,
}: {
  data: MappedCivStats;
  title: string;
}) {
  const sortedData = data.civStats.sort((a, b) => b.winRate - a.winRate);

  // State for dynamic chart size
  const [chartSize, setChartSize] = useState({ width: 800, height: 500 }); // Default size
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  // Resize the chart based on container size and data
  useEffect(() => {
    const handleResize = () => {
      if (chartContainerRef.current) {
        const containerWidth = chartContainerRef.current.offsetWidth;
        setChartSize({
          width: containerWidth,
          height: sortedData.length * 40, // Dynamic height based on the number of bars
        });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial resize on mount

    return () => window.removeEventListener("resize", handleResize);
  }, [sortedData]); // Re-run when data changes

  return (

  );
}
