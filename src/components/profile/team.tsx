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
    <div className={`flex items-center gap-2 ${className}`}>
      {teams.map((team: TeamResult, index: number) => (
        <div key={team.teamid} className="flex flex-col items-center gap-1">
          {/* versus
          {teams.length > 1 && (
            <div className="text-xl mx-4 flex items-center">vs</div>
          )} */}
          {/* player */}
          <Player
            team={team}
            matchHistoryMap={matchHistoryMap}
            handleNameClick={handleNameClick}
            gameMode={gameMode}
          />
        </div>
      ))}
    </div>
  );
}
