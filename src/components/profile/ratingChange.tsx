import { ArrowDown, ArrowUp } from "lucide-react";

interface IProps {
  ratingChange: number;
  gameMode: string;
}

export default function RatingChange({ ratingChange, gameMode }: IProps) {
  const isCustom = gameMode === "CUSTOM";
  if (isCustom) {
    ratingChange = -ratingChange; // flip the results because custom games are messed up
  }
  const ratingChangeColor = ratingChange > 0 ? "text-primary" : "text-red-500";

  return (
    <div className={`flex m-2 ${ratingChangeColor}`}>
      {!isCustom && <div className="mr-1">{ratingChange}</div>}
      {ratingChange > 0 ? (
        <ArrowUp className="text-primary" />
      ) : (
        <ArrowDown className="text-red-500" />
      )}
    </div>
  );
}
