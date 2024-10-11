// Function to process ratings of player matches and return average points

export const processRatings = (result: any) => {
  if (result.length > 0) {
    const allNewRatings = result[0].allNewRatings;
    const allDates = result[0].allDates;
    const step = Math.ceil(allNewRatings.length / 5);

    const dataPoints = [];
    for (let i = 0; i < allNewRatings.length; i += step) {
      const chunk = allNewRatings.slice(i, i + step);
      const chunkAvgRating =
        chunk.reduce((acc: number, rating: number) => acc + rating, 0) /
        chunk.length;
      const chunkDate = allDates[i];

      const formattedDate = new Date(chunkDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      dataPoints.push({
        date: formattedDate,
        averageRating: Math.round(chunkAvgRating),
      });
    }
    return dataPoints;
  }
  return [];
};
