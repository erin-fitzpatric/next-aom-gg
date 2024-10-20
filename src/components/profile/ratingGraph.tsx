import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegendContent,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartData } from "@/types/ChartData";
import { useCallback, useEffect, useState } from "react";
import { getMatchRatings } from "@/server/controllers/profile-rating";
const chartConfig = {
  solo: {
    label: "1V1_SUPREMACY",
    color: "#E23670",
  },
  team: {
    label: "TEAM_SUPREMACY",
    color: "#2761D9",
  },
} satisfies ChartConfig;

interface RatingLineChartProps {
  playerId: string;
}

const RatingLineChart: React.FC<RatingLineChartProps> = ({ playerId }) => {
  const [chartData, setChartData] = useState<{
    solo: ChartData[];
    team: ChartData[];
  }>({
    solo: [],
    team: [],
  });
  const soloData = chartData.solo;
  const teamData = chartData.team;
  const [filter, setFilter] = useState("day");
  const fetchChartData = useCallback(
    async (playerId: number, filter: string) => {
      try {
        const { chartData } = await getMatchRatings({
          playerId,
          filter,
        });
        setChartData(chartData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    },
    []
  );
  useEffect(() => {
    fetchChartData(parseInt(playerId, 10), filter);
  }, [playerId, filter, fetchChartData]);

  let lastTeamRating = teamData.length > 0 ? teamData[0].averageRating : 0;

  const combinedData = soloData.map((item, index) => {
    const currentTeamRating = teamData[index]?.averageRating ?? lastTeamRating;
    lastTeamRating = currentTeamRating;
    return {
      date: item.date,
      "1V1_SUP": item.averageRating,
      TEAM_SUP: currentTeamRating,
    };
  });

  const isSoloAllZero = soloData.every((item) => item.averageRating === 0);
  const isTeamAllZero = teamData.every((item) => item.averageRating === 0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <ResponsiveContainer width="100%">
      <Card className="shadow-lg rounded-lg border border-gray-700">
        <CardHeader>
          <div className="flex justify-between">
            <div className="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-chart-line"
              >
                <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
              <CardTitle className="ml-1 text-sm sm:ml-2 sm:text-base lg:text-xl">
                Ratings History
              </CardTitle>
            </div>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {["day", "week", "month"].map((f) => (
                <div
                  key={f}
                  className={`py-0.5 px-1.5 text-xs sm:text-sm border-white border rounded-sm cursor-pointer ${
                    filter === f ? "bg-white text-black" : ""
                  }`}
                  onClick={() => setFilter(f)}
                >
                  <div className="block lg:hidden">
                    {f === "day" ? "D" : f === "week" ? "W" : "M"}
                  </div>
                  <div className="hidden lg:block">
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart data={combinedData} margin={{ top: 10, right: 20 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tickFormatter={formatDate}
                type="category"
                interval={0}
                angle={-45}
                dy={10}
              />
              <YAxis
                domain={[0, 2000]}
                tickLine={false}
                axisLine={false}
                tickMargin={25}
                tickCount={10}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend content={<ChartLegendContent />} />

              {!isSoloAllZero && (
                <Line
                  dataKey="1V1_SUP"
                  type="monotone"
                  stroke="var(--color-solo)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              )}
              {!isTeamAllZero && (
                <Line
                  dataKey="TEAM_SUP"
                  type="monotone"
                  stroke="var(--color-team)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              )}
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </ResponsiveContainer>
  );
};

export default RatingLineChart;
