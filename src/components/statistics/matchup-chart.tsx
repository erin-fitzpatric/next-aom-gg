"use client";

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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { MatchupStats } from "@/types/CivStats";

export const description = "A bar chart with a custom label";

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

export function MatchupChart({ data }: { data: MatchupStats }) {
  let totalResults = 0;

  const chartData = Object.entries(data).map(([godName, godStats]) => {
    totalResults += godStats.totalResults;
    return {
      godName: godName,
      winRate: ((godStats.totalWins / godStats.totalResults) * 100).toFixed(1),
    };
  }).sort((a, b) => parseFloat(b.winRate) - parseFloat(a.winRate));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Matchups</CardTitle>
        <CardDescription>Games Analyzed {totalResults}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="godName"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
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
            >
              <LabelList
                dataKey="godName"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey="winRate"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
