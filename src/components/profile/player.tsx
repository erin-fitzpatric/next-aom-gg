import { MappedTeam } from "@/app/api/matchHistory/matchHelpers";
import { majorGodIndexToData } from "@/types/MajorGods";
import { TeamResult, MatchHistoryMap } from "@/types/MatchHistory";
import Image from "next/image";

interface Iprops {
  team: TeamResult;
  matchHistoryMap: MatchHistoryMap;
  handleNameClick: (row: number) => void;
  ratingChange: number;
}

export default function Player({
  team,
  matchHistoryMap,
  handleNameClick,
  ratingChange,
}: Iprops) {
  return (
    <>
      {team.results.map((player: MappedTeam) => {
        const { portraitPath, name: civName } = majorGodIndexToData(
          Number(player.civilization_id)
        );
        // const ratingChangeColor =
        //   ratingChange > 0 ? "text-primary" : "text-red-500";

        return (
          <div
            key={player.profile_id}
            className="flex flex-col md:flex-row items-center w-full lg:w-96 md:w-64 p-2 border rounded-lg m-1"
          >
            {/* Civ Image */}
            <div className="flex-shrink-0 mb-2 md:mb-0 md:mr-4">
              <Image
                src={portraitPath}
                alt={civName}
                width={54}
                height={54}
                className="rounded-full border-2 border-yellow-500"
              />
            </div>

            {/* Player Name */}
            <div
              className={`text-left cursor-pointer flex-1 mb-2 md:mb-0`}
              onClick={() => handleNameClick(player.profile_id)}
            >
              {player.playerName}
            </div>

            {/* Rating */}
            <div className="text-right">
              {matchHistoryMap[player.profile_id]?.[0]?.newrating}
            </div>
          </div>
        );
      })}
    </>
  );
}
