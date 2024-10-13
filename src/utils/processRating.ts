interface RatingEntry {
  _id: string;
  averageRating: number;
}

interface ProcessedRatingPoint {
  date: string;
  averageRating: number;
}

// Function to process ratings of player matches and return average points
export const processRatings = (
  result: RatingEntry[]
): ProcessedRatingPoint[] => {
  if (result.length > 0) {
    const dataPoints: ProcessedRatingPoint[] = result.map((entry) => ({
      date: new Date(entry._id).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      averageRating: Math.round(entry.averageRating),
    }));

    return dataPoints;
  }
  return [];
};
