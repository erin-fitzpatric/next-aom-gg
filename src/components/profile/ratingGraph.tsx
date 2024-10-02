import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  Tooltip,
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
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  solo: {
    label: "1V1_SUPREMACY",
    color: "hsl(var(--chart-1))",
  },
  team: {
    label: "TEAM_SUPREMACY",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface RatingLineChartProps {
  soloData: { date: string; rating: number }[];
  teamData: { date: string; rating: number }[];
}

const RatingLineChart: React.FC<RatingLineChartProps> = ({
  soloData,
  teamData,
}) => {
  const combinedData = soloData.map((item, index) => ({
    date: item.date,
    soloRating: item.rating,
    teamRating: teamData[index]?.rating || 0,
  }));

  return (
    <ResponsiveContainer width="50%" height={200}>
      <Card>
        <CardHeader>
          <CardTitle>Player Ratings</CardTitle>
          <CardDescription>Rating trends over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart data={combinedData} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Line
                dataKey="soloRating"
                type="monotone"
                stroke="var(--color-solo)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="teamRating"
                type="monotone"
                stroke="var(--color-team)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </ResponsiveContainer>
  );
};

export default RatingLineChart;
