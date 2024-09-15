import { formatTime } from "@/app/api/matchHistory/matchHelpers";
import { MappedMatchHistoryData } from "@/types/MatchHistory";
import Image from "next/image";
import { useRouter } from "next/navigation";
import RatingChange from "./ratingChange";
import Team from "./team";

type IProps = {
  match: MappedMatchHistoryData;
};

export default function Match({ match }: IProps) {
  const router = useRouter();
  const {
    mapData,
    matchDate,
    matchType,
    teams,
    ratingChange,
    matchHistoryMap,
    matchDuration,
    gameMode,
  } = match;
  const isWinner = teams[0].results[0].resulttype ? true : false; // 0 = loss, 1 = win

  const handleNameClick = (row: number) => {
    const route = `/profile/${row}`;
    router.push(route);
  };


  return (
    <div className="p-4 border rounded-md shadow-lg flex flex-col md:flex-row md:space-x-4">
      <div className="flex flex-col items-center md:items-start justify-center flex-shrink-0 h-full">
        <div className="text-xl font-semibold text-center mb-2">
          {new Date(matchDate).toLocaleDateString()}
        </div>
        {/* Map */}
        {mapData && (
          <div className="flex justify-center items-center h-full">
            <Image
              src={mapData.imagePath}
              alt={mapData.name}
              width={164}
              height={164}
              className="md:block hidden"
            />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col justify-center space-y-2 flex-grow text-center mx-auto md:text-left md:mx-0">
        <div>{gameMode}</div>
        <div>{matchType}</div>
        <div>{mapData.name}</div>
        <div>{formatTime(Math.floor(matchDuration))}</div>
      </div>

      <div className="flex flex-col items-center md:items-end flex-shrink space-y-4">
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
