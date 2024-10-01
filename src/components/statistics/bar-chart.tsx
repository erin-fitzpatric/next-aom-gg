"use client";

import { useState, useCallback } from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
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
import { Formatter } from "recharts/types/component/DefaultTooltipContent";

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

interface BarChartProps<T, K extends Extract<keyof T, string>> {
  compareFn?: (a: T, b: T) => number;
  data: T[];
  title: string;
  totalGamesAnalyzed?: number;
  xAxisKey: K;
  xAxisFormatter?: (value: number) => string;
  yAxisKey: K;
  yAxisFormatter?: (value: number) => string;
  leftDataKey?: K;
  leftDataFormatter?: (value: number) => string;
  rightDataKey?: K;
  rightDataFormatter?: (value: number) => number;
  footerContent?: React.ReactNode;
  tooltipFormatter?: Formatter<any, any>;
}

export default function BarChart<T, K extends Extract<keyof T, string>>({
  xAxisKey,
  xAxisFormatter,
  yAxisKey,
  yAxisFormatter,
  leftDataKey,
  leftDataFormatter,
  rightDataKey,
  rightDataFormatter,
  data,
  title,
  compareFn,
  totalGamesAnalyzed,
  footerContent,
  tooltipFormatter,
}: BarChartProps<T, K>) {
  const sortedData = [...data.sort(compareFn)].map((value, index, array) => ({
    ...value,
    className:
      classNamesScheme[
        Math.floor((index / array.length) * classNamesScheme.length)
      ],
    ...(rightDataKey &&
      rightDataFormatter && {
        [rightDataKey]: rightDataFormatter(value[rightDataKey] as number),
      }),
  }));

  // State for dynamic chart size
  const [chartSize, setChartSize] = useState({
    width: window.innerWidth,
    height: sortedData.length * 20,
  }); // Default size

  // Resize the chart based on container size and data
  const refCallback = useCallback(
    (node: HTMLDivElement) => {
      const handleResize = () => {
        if (node) {
          const containerWidth = node.offsetWidth;
          setChartSize({
            width: containerWidth,
            height: sortedData.length * 60,
          });
        }
      };

      window.addEventListener("resize", handleResize);
      handleResize(); // Initial resize on mount

      return () => window.removeEventListener("resize", handleResize);
    },
    [data]
  ); // Re-run when data changes

  const getFontSize = () => {
    if (chartSize.width < chartSizes.sm) {
      return 16;
    }
    return 20;
  };

  const getMargin = () => {
    if (chartSize.width < chartSizes.sm) {
      return { left: 20, right: 20 };
    }
    if (chartSize.width < chartSizes.md) {
      return { left: 30, right: 30 };
    }
    return { left: 40, right: 40 };
  };

  return (
    <>
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
      <CardContent style={{ minHeight: "900px" }}>
        {" "}
        {/* Ensures content area has minimum height */}
        <ChartContainer config={chartConfig}>
          <div className="w-100 gap-20 h-fit" ref={refCallback}>
            <RechartsBarChart
              margin={getMargin()}
              accessibilityLayer
              data={sortedData}
              layout="vertical"
              width={chartSize.width} // Use dynamic width
              height={chartSize.height} // Use dynamic height based on data
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey={yAxisKey}
                type="category"
                tickLine={false}
                axisLine={false}
                fontSize={getFontSize()}
              />
              <XAxis dataKey={xAxisKey} type="number" hide />
              <ChartTooltip
                content={<ChartTooltipContent indicator="line" />}
                formatter={tooltipFormatter}
              />
              <Bar
                dataKey={xAxisKey}
                layout="vertical"
                fill="var(--color-desktop)"
                radius={8}
                barSize={20}
              >
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
                  formatter={xAxisFormatter}
                />
                <LabelList
                  dataKey={leftDataKey}
                  position="bottom"
                  fontSize={getFontSize()}
                  formatter={leftDataFormatter}
                />
              </Bar>
            </RechartsBarChart>
          </div>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {footerContent}
      </CardFooter>
    </>
  );
}
