export type ChartDataItem = {
  date: string;
  averageRating: number;
};

export type ChartData = {
  day: ChartDataItem[];
  week: ChartDataItem[];
  month: ChartDataItem[];
};

export type CombinedChartData = {
  solo: ChartData;
  team: ChartData;
};
