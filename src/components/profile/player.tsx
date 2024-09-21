import { MappedTeam } from "@/app/api/matchHistory/matchHelpers";
import { majorGodIndexToData } from "@/types/MajorGods";
import { TeamResult, MatchHistoryMap } from "@/types/MatchHistory";
import Image from "next/image";

interface Iprops {
  team: TeamResult;
  matchHistoryMap: MatchHistoryMap;
  handleNameClick: (row: number) => void;
  gameMode: string;
}

export default function Player({
  team,
  matchHistoryMap,
  handleNameClick,
  gameMode,
}: Iprops) {
  const isCustom = gameMode === "CUSTOM";

  return (
    <>
      {team.results.map((player: MappedTeam) => {
        const { portraitPath, name: civName } = majorGodIndexToData(
          Number(player.civilization_id),
        );
        const isWinner = player.resulttype === 1;
        const ratingChangeColor = isWinner
          ? "border-primary"
          : "border-red-500";

        return (
          <div
            key={player.profile_id}
            className="flex flex-col gap-1 shadow-card md:flex-row items-center w-full"
          >
            {/* Civ Image */}
            <Image
              src={portraitPath}
              alt={civName}
              width={24}
              height={24}
              className={`rounded-full border-2 ${ratingChangeColor}`}
            />
            {/* Player Name */}
            <div
              className="text-base text-left cursor-pointer flex-1 mb-2 md:mb-0 overflow-hidden truncate mr-2"
              onClick={() => handleNameClick(player.profile_id)}
              title={player.playerName}
            >
              {player.playerName}
            </div>

            {/* Rating */}
            {!isCustom && (
              <div className="text-small font-light text-right">
                {matchHistoryMap[player.profile_id]?.[0]?.newrating}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
