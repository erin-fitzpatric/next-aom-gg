export const getStartDate = (filter: string): number => {
  const today = new Date();
  let startDate: number;

  switch (filter) {
    case "day":
      const past30Days = new Date(today);
      past30Days.setDate(today.getDate() - 30);
      startDate = past30Days.getTime();
      break;
    case "week":
      const pastWeeks = new Date(today);
      pastWeeks.setDate(today.getDate() - 60); // Adjust as needed for 7-8 weeks
      startDate = pastWeeks.getTime();
      break;
    case "month":
      const pastMonths = new Date(today);
      pastMonths.setMonth(today.getMonth() - 5); // Adjust as needed for 4-5 months
      startDate = pastMonths.getTime();
      break;
    default:
      throw new Error("Invalid filter selected");
  }

  return startDate;
};
