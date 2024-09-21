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
    <div className="w-auto grid-cols-12">
      <Map mapData={mapData} />
      <div className="text-xl font-semibold text-center mb-2">
        {new Date(matchDate).toLocaleDateString()}
      </div>
      {/* Details */}
      <div className="flex flex-col justify-center space-y-2 flex-grow text-center mx-auto xl:text-left xl:mx-0">
        <div>{gameMode}</div>
        <div>{matchType}</div>
        <div>{mapData.name}</div>
        <div>{formatTime(Math.floor(matchDuration))}</div>
      </div>

      <div className="flex flex-col items-center xl:items-end flex-shrink space-y-4">
        {/* Rating Change */}
        <RatingChange
          ratingChange={ratingChange}
          gameMode={gameMode}
          isWinner={isWinner}
        />
        {/* Teams */}
        <Team
          teams={teams}
          matchHistoryMap={matchHistoryMap}
          handleNameClick={handleNameClick}
          gameMode={gameMode}
        />
      </div>
    </div>
  );
}
