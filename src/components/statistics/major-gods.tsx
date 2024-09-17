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
import { TrendingUp } from "lucide-react";

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
    <Card style={{ minHeight: "600px" }}> {/* Ensures the card has a minimum height */}
      <CardHeader>
        <CardTitle className="text-gold">{title}</CardTitle>
        <CardDescription className="text-secondary-foreground">
          Total Games Analyzed: {data.totalGamesAnalyzed}
        </CardDescription>
      </CardHeader>
      <CardContent style={{ minHeight: "500px" }}> {/* Ensures content area has minimum height */}
        <ChartContainer config={chartConfig}>
          <div
            className="w-100"
            ref={chartContainerRef}
            style={{ minHeight: "500px" }} // Ensures chart container has a minimum height
          >
            <BarChart
              accessibilityLayer
              data={sortedData}
              layout="vertical"
              margin={{ right: 16 }}
              width={chartSize.width} // Use dynamic width
              height={chartSize.height} // Use dynamic height based on data
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="godName"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                hide
              />
              <XAxis dataKey="winRate" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
                formatter={(value: number) => `${(value * 100).toFixed(1)}%`}
              />
              <Bar
                dataKey="winRate"
                layout="vertical"
                fill="var(--color-desktop)"
                radius={4}
                barSize={30}
              >
                <LabelList
                  dataKey="godName"
                  position="insideLeft"
                  offset={8}
                  className="fill-[--color-label]"
                  fontSize={24}
                />
                <LabelList
                  dataKey="winRate"
                  position="insideRight"
                  offset={8}
                  className="fill-foreground"
                  fontSize={24}
                  formatter={(value: number) => `${(value * 100).toFixed(1)}%`}
                />
                <LabelList
                  dataKey="totalGames"
                  position="outside"
                  offset={8}
                  className="fill-foreground"
                  fontSize={24}
                  formatter={(value: number) => `Games: ${value}`}
                />
              </Bar>
            </BarChart>
          </div>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* Additional Footer content */}
      </CardFooter>
    </Card>
  );
}
