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
import { cn } from "@/utils/utils";

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

const chartSizes = {
  sm: 620,
  md: 800,
};

const classNamesScheme = [
  "fill-[#569d5d]",
  "fill-[#4a8c52]",
  "fill-[#3f7b47]",
  "fill-[#346a3c]",
  "fill-[#295931]",
  "fill-[#1f4826]",
];

interface BarChartProps<T> {
  compareFn?: (a: T, b: T) => number;
  data: T[];
  title: string;
  totalGamesAnalyzed?: number;
  xAxisKey: string;
  yAxisKey: string;
  leftDataKey?: string;
  rightDataKey?: string;
  dataKeyMiddle?: string;
  footerContent?: React.ReactNode;
}

export default function BarChart<T>({
  yAxisKey,
  xAxisKey,
  leftDataKey = "totalGames",
  rightDataKey = "pickRate",
  data,
  title,
  compareFn,
  totalGamesAnalyzed,
  footerContent,
}: BarChartProps<T>) {
  const sortedData = [...data.sort(compareFn)].map((value, index, array) => ({
    ...value,
    className:
      classNamesScheme[
        Math.floor((index / array.length) * classNamesScheme.length)
      ],
  }));

  // State for dynamic chart size
  const [chartSize, setChartSize] = useState({ width: window.innerWidth, height: 500 }); // Default size
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

  const getFontSize = () => {
    if (chartSize.width < chartSizes.sm) {
      return 16;
    }
    return 20;
  };

  return (
    <Card style={{ minHeight: "600px" }}>
      {" "}
      {/* Ensures the card has a minimum height */}
      <CardHeader>
        <CardTitle className="text-gold">{title}</CardTitle>
        {totalGamesAnalyzed && (
          <CardDescription className="text-secondary-foreground">
            Total Games Analyzed: {totalGamesAnalyzed}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent style={{ minHeight: "500px" }}>
        {" "}
        {/* Ensures content area has minimum height */}
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
                content={<ChartTooltipContent indicator="line" />}
                formatter={(value: number) =>
                  `Winrate ${(value * 100).toFixed(1)}%`
                }
              />

              <Bar
                dataKey={xAxisKey}
                layout="vertical"
                fill="var(--color-desktop)"
                radius={8}
                barSize={30}
              >
                <LabelList
                  dataKey={yAxisKey}
                  position="insideLeft"
                  offset={8}
                  className="fill-foreground"
                  fontSize={getFontSize()}
                />
                <LabelList
                  dataKey={xAxisKey}
                  position={
                    chartSize && chartSize.width >= chartSizes.sm
                      ? "right"
                      : "insideRight"
                  }
                  offset={8}
                  className="fill-foreground"
                  fontSize={getFontSize()}
                  formatter={(value: number) => `${(value * 100).toFixed(1)}%`}
                />
                <LabelList
                  dataKey={leftDataKey}
                  position="insideLeft"
                  className={cn("fill-foreground text-black", {
                    "translate-x-[20%] text-sm":
                      chartSize.width < chartSizes.sm,
                    "translate-x-[15%]": chartSize.width >= chartSizes.sm,
                  })}
                  fontSize={getFontSize()}
                  formatter={(value: number) => `${value} games`}
                />
                <LabelList
                  dataKey={rightDataKey}
                  position="insideLeft"
                  className={cn("fill-foreground text-black", {
                    "translate-x-[55%] hidden": chartSize.width < chartSizes.sm,
                    "translate-x-[40%]": chartSize.width >= chartSizes.sm,
                  })}
                  fontSize={getFontSize()}
                  formatter={(value: number) =>
                    `${(value * 100).toFixed(1)}% pick rate`
                  }
                />
              </Bar>
            </RechartsBarChart>
          </div>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {footerContent}
      </CardFooter>
    </Card>
  );
}
