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
    <div className="w-full grid grid-cols-4 md:grid-cols-8 grid-rows-2 md:grid-rows-1 items-center border-b py-4">
      <div className="col-span-1 md:col-span-1 justify-self-center order-1">
        <Map mapData={mapData} />
      </div>
      {/* Details */}
      <div className="col-span-1 md:col-span-1 flex flex-col justify-center space-y-2 px-2 order-2">
        <div className="text-sm font-semibold">{mapData.name}</div>
        <div className="text-sm text-gray-200">{makeReadable(gameMode)}</div>
        <div className="text-sm text-gray-200">
          {formatTime(Math.floor(matchDuration))}
        </div>
        <div className="text-xs text-gray-200">
          {new Date(matchDate).toLocaleDateString()}
        </div>
        <div className="text-xs text-gray-200">{matchType}</div>
      </div>

      {/* Teams */}
      <Team
        activePlayerId={playerId}
        teams={teams}
        matchHistoryMap={matchHistoryMap}
        handleNameClick={handleNameClick}
        gameMode={gameMode}
        className="col-span-3 md:col-span-5 order-4 md:order-3"
      />
      {/* Rating Change */}
      <RatingChange
        ratingChange={ratingChange}
        gameMode={gameMode}
        isWinner={isWinner}
        className="col-span-1 md:col-span-1 justify-center order-3 md:order-4"
      />
    </div>
  );
}

function makeReadable(inputString: string): string {
  // Replace underscores with spaces
  let spacedString = inputString.replace(/_/g, " ");

  // Capitalize the first letter of each word, make the rest lowercase
  let words = spacedString.split(" ");
  let capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
  );

  // Join the words back together
  let result = capitalizedWords.join(" ");

  // Special handling for strings starting with numbers
  if (/^\d/.test(result)) {
    // Find the index of the first alphabetic character
    let firstLetterIndex = result.search(/[a-zA-Z]/);

    if (firstLetterIndex !== -1) {
      // Keep the initial numeric part as is, and ensure the first alphabetic character is uppercase
      result =
        result.slice(0, firstLetterIndex) +
        result.charAt(firstLetterIndex).toUpperCase() +
        result.slice(firstLetterIndex + 1);
    }
  }

  return result;
}
