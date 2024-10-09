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

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegendContent,
  ChartTooltipContent,
} from "@/components/ui/chart";

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
  soloData: { date: string; averageRating: number }[];
  teamData: { date: string; averageRating: number }[];
}

const RatingLineChart: React.FC<RatingLineChartProps> = ({
  soloData,
  teamData,
}) => {
  console.log(soloData, teamData);
  let lastTeamRating = teamData.length > 0 ? teamData[0].averageRating : 0;

  const combinedData = soloData.map((item, index) => {
    const currentTeamRating = teamData[index]?.averageRating ?? lastTeamRating;
    lastTeamRating = currentTeamRating;
    return {
      date: item.date,
      "1V1": item.averageRating,
      TEAM: currentTeamRating,
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
          <CardTitle>Player Ratings</CardTitle>
          <CardDescription>Rating trends over time</CardDescription>
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
                  dataKey="1V1"
                  type="monotone"
                  stroke="var(--color-solo)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              )}
              {!isTeamAllZero && (
                <Line
                  dataKey="TEAM"
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
