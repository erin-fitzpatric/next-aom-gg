export interface ChartData {
  date: string;
  averageRating: number;
}

export interface CombinedChartData {
  chartData: {
    solo: ChartData[];
    team: ChartData[];
  };
}
