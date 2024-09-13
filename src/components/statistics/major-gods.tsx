"use client";

import { useEffect, useState } from "react";
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

  // State for dynamic font size
  const [chartWidth, setChartWidth] = useState(window.innerWidth); // Default width

  // Dynamically adjust font size based on screen width
  useEffect(() => {
    const handleResize = () => {
      setChartWidth(window.innerWidth); // Adjust width based on window size
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial call

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-gold">{title}</CardTitle>
        <CardDescription className="text-secondary-foreground">
          Total Games Analyzed: {data.totalGamesAnalyzed}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <div className="w-100">
            <BarChart
              accessibilityLayer
              data={sortedData}
              layout="vertical"
              margin={{
                right: 16,
              }}
              width={chartWidth} // You can adjust this based on your needs
              height={500} // Fix the height to avoid vertical spacing changes
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
              />
              <Bar
                dataKey="winRate"
                layout="vertical"
                fill="var(--color-desktop)"
                radius={4}
                barSize={30} // Adjust this value for fixed bar width
              >
                <LabelList
                  dataKey="godName"
                  position="insideLeft"
                  offset={8}
                  className="fill-[--color-label]"
                  fontSize={24} // Dynamic font size
                />
                <LabelList
                  dataKey="winRate"
                  position="insideStart"
                  offset={8}
                  className="fill-foreground"
                  fontSize={24} // Dynamic font size
                  formatter={(value: number) => `${(value * 100).toFixed(1)}%`}
                />
                <LabelList
                  dataKey="totalGames"
                  position="insideRight"
                  offset={8}
                  className="fill-foreground"
                  fontSize={24} // Dynamic font size
                  formatter={(value: number) => `Games: ${value}`}
                />
              </Bar>
            </BarChart>
          </div>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div> */}
      </CardFooter>
    </Card>
  );
}
