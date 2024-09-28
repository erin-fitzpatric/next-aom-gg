import { formatTime } from "@/app/api/matchHistory/matchHelpers";
import { Match as MatchType } from "@/types/Match";
import { useRouter } from "next/navigation";
import { Map } from "./map";
import RatingChange from "./ratingChange";
import Team from "./team";

type IProps = {
  match: MatchType;
  playerId: string;
};

export default function MatchComponent({ match, playerId }: IProps) {
  const router = useRouter();
  const {
    mapData,
    matchDate,
    matchType,
    teams,
    ratingChange = 0,
    matchHistoryMap,
    matchDuration,
    gameMode,
  } = match;
  const isWinner = Boolean(teams[0].results[0].resulttype); // 0 = loss, 1 = win

  const handleNameClick = (row: number) => {
    const route = `/profile/${row}`;
    router.push(route);
  };

  return (
    <div className="w-full grid grid-cols-8 items-center border-b py-4">
      <div className="col-span-1 justify-self-center">
        <Map mapData={mapData} />
      </div>
      {/* Details */}
      <div className="col-span-1 flex flex-col justify-center space-y-2 px-2">
        <div className="text-sm font-semibold">{mapData.name}</div>
        <div className="text-xs text-gray-600">{gameMode}</div>
        <div className="text-xs text-gray-600">
          {formatTime(Math.floor(matchDuration))}
        </div>
        <div className="text-xs text-gray-600">{matchType}</div>
      </div>
      <div className="col-span-1 text-sm font-semibold text-center">
        {new Date(matchDate).toLocaleDateString()}
      </div>

      {/* Teams */}
      <Team
        activePlayerId={playerId}
        teams={teams}
        matchHistoryMap={matchHistoryMap}
        handleNameClick={handleNameClick}
        gameMode={gameMode}
        className="col-span-3"
      />
      {/* Rating Change */}
      <RatingChange
        ratingChange={ratingChange}
        gameMode={gameMode}
        isWinner={isWinner}
        className="col-span-1 justify-center"
      />
    </div>
  );
}
