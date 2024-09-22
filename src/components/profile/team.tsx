import { MatchHistoryMap, TeamResult } from "@/types/MatchHistory";
import Player from "./player";

interface IProps {
  teams: TeamResult[];
  matchHistoryMap: MatchHistoryMap;
  handleNameClick: (row: number) => void;
  gameMode: string;
  className: string;
}

export default function Team({
  teams,
  matchHistoryMap,
  handleNameClick,
  gameMode,
  className,
}: IProps) {
  return (
    <div className={`grid grid-cols-[3fr,1fr,3fr] gap-1 ${className}`}>
      {teams.map((team: TeamResult, i) => (
        <>
          <div key={team.teamid} className="flex flex-col gap-1">
            {team.results.map((player, i) => (
              <Player
                key={player.profile_id}
                player={player}
                matchHistoryMap={matchHistoryMap}
                handleNameClick={handleNameClick}
                gameMode={gameMode}
              />
            ))}
          </div>
          {i === 0 && (
            <div className="flex flex-col align-middle justify-center text-center">
              VS
            </div>
          )}
        </>
      ))}
    </div>
  );
}
