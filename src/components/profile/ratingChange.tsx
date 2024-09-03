import { ArrowDown, ArrowUp } from "lucide-react";

interface IProps {
  ratingChange: number;
}

export default function RatingChange({ ratingChange }: IProps) {
  const ratingChangeColor = ratingChange > 0 ? "text-primary" : "text-red-500";

  return (
    <div className={`flex m-2 ${ratingChangeColor}`}>
      <div className="mr-1">{ratingChange}</div>
      {ratingChange > 0 ? (
        <ArrowUp className="text-primary" />
      ) : (
        <ArrowDown className="text-red-500" />
      )}
    </div>
  );
}
