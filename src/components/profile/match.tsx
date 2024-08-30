import { majorGodIndexToData } from "@/types/MajorGods";
import { MatchHistoryStat, Profile } from "@/types/MatchHistory";
import { getMatchTypeNameById } from "@/types/MatchTypes";
import { randomMapNameToData } from "@/types/RandomMap";
import Image from "next/image";
import {
  parseMapName,
  mapToTeams,
  createMatchHistoryMap,
  formatTime,
} from "./matchHelpers";
import { useRouter } from "next/navigation";

type IProps = {
  match: MatchHistoryStat;
  profiles: Record<number, Profile>;
  playerId: number;
};

export default function Match({ match, profiles, playerId }: IProps) {
  const router = useRouter();

  const {
    mapname,
    matchtype_id,
    startgametime,
    completiontime,
    description,
    matchhistoryreportresults,
    matchhistorymember,
  } = match;
  const parsedMapName = parseMapName(mapname);
  const mapData = randomMapNameToData(parsedMapName);
  const matchDuration = completiontime - startgametime;
  const matchDate = startgametime * 1000;
  const teams = mapToTeams(matchhistoryreportresults, playerId);
  const matchHistoryMap = createMatchHistoryMap(matchhistorymember);

  const handleNameClick = (row: number) => {
    const route = `/profile/${row}`;
    router.push(route);
  };

  return (
    <div className="p-4 border rounded-md shadow-lg flex flex-col md:flex-row items-start">
      {mapname && (
        <div className="flex items-start md:w-1/3 mb-4 md:mb-0">
          <Image
            src={mapData.imagePath}
            alt={mapname}
            width={100}
            height={100}
            className="md:block hidden mr-4"
          />
          <span className="block md:hidden">{mapname}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:w-2/3 w-full">
        <div className="flex flex-wrap items-center mb-4 md:mb-0">
          <div className="mr-4 mb-2 md:mb-0">
            {new Date(matchDate).toLocaleDateString()}
          </div>
          <div className="mr-4 mb-2 md:mb-0">
            {description === "AUTOMATCH" ? "Ranked" : description}
          </div>
          <div className="mr-4 mb-2 md:mb-0">
            {getMatchTypeNameById(matchtype_id)}
          </div>
          <div className="mr-4 mb-2 md:mb-0">
            {formatTime(Math.floor(matchDuration))}
          </div>
        </div>

        <div className="w-full">
          <div className="grid grid-cols-1 gap-4">
            {teams.map((team) => (
              <div key={team.teamid} className="flex flex-wrap">
                {team.results.map((player, index) => {
                  // Access data from matchHistoryMap
                  const history = matchHistoryMap[player.profile_id]?.[index];
                  const ratingChange = history
                    ? history.newrating - history.oldrating
                    : "Unknown";
                  const currentRating = history ? history.newrating : "Unknown";
                  const alias = profiles[player.profile_id]?.alias || "Unknown";
                  const civilizationName =
                    majorGodIndexToData(Number(player.civilization_id))?.name ||
                    "Unknown";

                  // Determine the text color based on ratingChange
                  const textColor =
                    typeof ratingChange === "number" && ratingChange < 0
                      ? "text-red-500"
                      : "text-primary";

                  return (
                    <div
                      key={player.profile_id}
                      className="flex flex-col md:flex-row items-center w-full mb-2"
                    >
                      <div
                        className={`flex-1 ${textColor} text-right`}
                        style={{ minWidth: "80px" }}
                      >
                        {ratingChange}
                      </div>
                      <div
                        className={`flex-1 ${textColor} text-right cursor-pointer`}
                        style={{ minWidth: "80px" }}
                        onClick={() => handleNameClick(player.profile_id)}
                      >
                        {alias}
                      </div>
                      <div
                        className="flex-1 text-right"
                        style={{ minWidth: "80px" }}
                      >
                        {currentRating}
                      </div>
                      <div
                        className="flex-1 text-right"
                        style={{ minWidth: "80px" }}
                      >
                        {civilizationName}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
