export const formatTimeAgoInMs = (timestamp: number): string => {
  // Convert timestamp to milliseconds
  const date = new Date(timestamp * 1000);
  const now = new Date();

  const diffInMilliseconds = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    } else {
      return `Just now`; // For timestamps less than a minute old
    }
  } else {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }
};