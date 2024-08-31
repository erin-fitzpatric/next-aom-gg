import { MatchHistoryMap, TeamResult } from "@/types/MatchHistory";
import Player from "./player";

interface IProps {
  teams: TeamResult[];
  matchHistoryMap: MatchHistoryMap;
  handleNameClick: (row: number) => void;
  ratingChange: number;
}

export default function Team({
  teams,
  matchHistoryMap,
  handleNameClick,
  ratingChange,
}: IProps) {
  return (
    <div className="flex items-center">
      {teams.map((team: TeamResult, index: number) => (
        <div key={team.teamid} className="flex flex-col items-center">
          {/* versus
          {teams.length > 1 && (
            <div className="text-xl mx-4 flex items-center">vs</div>
          )} */}
          {/* player */}
          <Player
            team={team}
            matchHistoryMap={matchHistoryMap}
            handleNameClick={handleNameClick}
            ratingChange={ratingChange}
          />
        </div>
      ))}
    </div>
  );
}
