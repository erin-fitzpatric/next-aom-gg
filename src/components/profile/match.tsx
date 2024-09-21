import { formatTime } from "@/app/api/matchHistory/matchHelpers";
import { Match as MatchType } from "@/types/Match";
import { useRouter } from "next/navigation";
import { Map } from "./map";
import RatingChange from "./ratingChange";
import Team from "./team";
type IProps = {
  match: MatchType;
};

export default function MatchComponent({ match }: IProps) {
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
    <div className="w-auto grid grid-cols-12 items-center border-b">
      <div className="col-span-2 justify-self-center">
        <Map mapData={mapData} />
      </div>
      <div className="col-span-2 flex flex-col justify-center space-y-2 flex-grow text-center mx-auto xl:text-left xl:mx-0">
        <div className="text-sm">{mapData.name}</div>
        <div className="text-sm">{gameMode}</div>
        <div className="text-sm">{formatTime(Math.floor(matchDuration))}</div>
        <div className="text-sm">{matchType}</div>
      </div>
      <div className="text-base font-semibold text-center mb-2">
        {new Date(matchDate).toLocaleDateString()}
      </div>
      {/* Details */}

      {/* Teams */}
      <Team
        teams={teams}
        matchHistoryMap={matchHistoryMap}
        handleNameClick={handleNameClick}
        gameMode={gameMode}
        className="col-span-6"
      />
      {/* Rating Change */}
      <RatingChange
        ratingChange={ratingChange}
        gameMode={gameMode}
        isWinner={isWinner}
        className="col-span-1"
      />
    </div>
  );
}
