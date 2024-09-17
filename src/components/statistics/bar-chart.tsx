"use client";

import { useEffect, useState, useRef } from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
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


interface BarChartProps<T> {
    compareFn?: (a: T, b: T) => number
    data: T[]
    title: string
    totalGamesAnalyzed?: number
    xAxisKey: string
    yAxisKey: string
    dataKeyMiddle?: string
}

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

const classNamesScheme = [
  "fill-green-500",
  "fill-green-600",
  "fill-green-700",
  "fill-green-800",
]

export default function BarChart<T>({ yAxisKey, xAxisKey, dataKeyMiddle = 'totalGames', data, title, compareFn, totalGamesAnalyzed }: BarChartProps<T>) {
  const sortedData = [...data.sort(compareFn)].map((value, index, array) => ({...value, className: classNamesScheme[Math.floor((index / array.length) * classNamesScheme.length)]}))

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
    }, [data]); // Re-run when data changes
  return (
    <Card style={{ minHeight: "600px" }}> {/* Ensures the card has a minimum height */}
    <CardHeader>
      <CardTitle className="text-gold">{title}</CardTitle>
      {totalGamesAnalyzed && <CardDescription className="text-secondary-foreground">
        Total Games Analyzed: {totalGamesAnalyzed}
      </CardDescription>}
    </CardHeader>
    <CardContent style={{ minHeight: "500px" }}> {/* Ensures content area has minimum height */}
      <ChartContainer config={chartConfig}>
        <div
          className="w-100"
          ref={chartContainerRef}
          style={{ minHeight: "500px" }} // Ensures chart container has a minimum height
        >
          <RechartsBarChart
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
            <XAxis dataKey={xAxisKey} type="number" hide />
            <ChartTooltip
            label="godName"
              content={<ChartTooltipContent labelKey="godName" nameKey="godName" indicator="line" />}
              formatter={(value: number) => `Winrate ${(value * 100).toFixed(1)}%`}
            />
           
            <Bar
              dataKey="winRate"
              layout="vertical"
              fill="var(--color-desktop)"
              radius={4}
              barSize={30}
            >
              <LabelList
                dataKey={yAxisKey}
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={20}
              />
              <LabelList
                dataKey={xAxisKey}
                position={chartSize && chartSize.width >= 768 ? "right" : "insideRight"}
                offset={8}
                className="fill-foreground"
                fontSize={20}
                formatter={(value: number) => `${(value * 100).toFixed(1)}%`}
              />
              <LabelList
                dataKey={dataKeyMiddle}
                position="insideLeft"
                className="fill-foreground hidden sm:block text-black sm:translate-x-24 md:translate-x-36"
                fontSize={20}
                formatter={(value: number) => `${value} games`}
              />
              {/* <LabelList
                dataKey={dataKeyMiddle}
                position={chartSize && chartSize.width < 768 ? "insideRight" : "right"}
                className="fill-foreground hidden sm:block text-black sm:translate-x-24 md:translate-x-36"
                fontSize={20}
                formatter={(value: number) => `${value} games`}
              /> */}
            </Bar>
            <Bar   dataKey="pickRate"
              layout="vertical"
              fill="var(--color-desktop)"
              radius={4}
              barSize={30}>
              <LabelList
                dataKey={dataKeyMiddle}
                position={chartSize && chartSize.width < 768 ? "insideRight" : "right"}
                className="fill-foreground hidden sm:block text-black sm:translate-x-24 md:translate-x-36"
                fontSize={20}
                formatter={(value: number) => `${value} games`}
              />
            </Bar>
          </RechartsBarChart>
        </div>
      </ChartContainer>
    </CardContent>
    <CardFooter className="flex-col items-start gap-2 text-sm">
      {/* Additional Footer content */}
    </CardFooter>
  </Card>
  );
}
