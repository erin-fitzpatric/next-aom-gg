import { TeamResult } from "@/types/MatchHistory";
import { ArrowDown, ArrowUp } from "lucide-react";

interface IProps {
  ratingChange: number;
  gameMode: string;
  isWinner: Boolean;
  className: string;
}

export default function RatingChange({
  ratingChange,
  gameMode,
  isWinner,
  className,
}: IProps) {
  const isCustom = gameMode === "CUSTOM";
  const ratingChangeColor = isWinner ? "text-primary" : "text-red-500";

  return (
    <div className={`flex m-2 ${ratingChangeColor} ${className}`}>
      {!isCustom && <div className="mr-1">{ratingChange}</div>}
      {isWinner ? (
        <ArrowUp className="text-primary" />
      ) : (
        <ArrowDown className="text-red-500" />
      )}
    </div>
  );
}
