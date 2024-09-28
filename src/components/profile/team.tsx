import { MatchHistoryMap, TeamResult } from "@/types/MatchHistory";
import Player from "./player";
import React from "react";

interface IProps {
  teams: TeamResult[];
  matchHistoryMap: MatchHistoryMap;
  handleNameClick: (row: number) => void;
  gameMode: string;
  className: string;
  activePlayerId: string;
}

export default function Team({
  teams,
  matchHistoryMap,
  handleNameClick,
  gameMode,
  className,
  activePlayerId,
}: IProps) {
  return (
    <div className={`grid grid-cols-[3fr,1fr,3fr] gap-1 ${className}`}>
      {teams.map((team: TeamResult, i) => (
        <React.Fragment key={`team-${team.teamid}-${i}`}>
          <div className="flex flex-col gap-1">
            {team.results.map((player) => (
              <Player
                key={player.profile_id}
                isActivePlayer={activePlayerId === player.profile_id.toString()}
                player={player}
                matchHistoryMap={matchHistoryMap}
                handleNameClick={handleNameClick}
                gameMode={gameMode}
              />
            ))}
          </div>
          {i === 0 && (
            <div className="hidden md:flex flex-col align-middle justify-center text-center">
              x
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
