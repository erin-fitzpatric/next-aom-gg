"use client";

import TeamTile from "./team-tile";
import RecTitle from "./rec-title";
import RecMap from "./rec-map";
import RecFooter from "./rec-footer";
import { useContext } from "react";
import { WindowContext } from "../provider/window-provider";
import { IRecordedGame } from "@/types/RecordedGame";
import { splitTeams } from "@/server/teams";

interface RecTileProps {
  rec: IRecordedGame;
  showMap?: boolean;
}

export default function RecTile({ rec, showMap = true }: RecTileProps) {
  const windowSize = useContext(WindowContext);
  // TODO - process team data

  const teamSplit = splitTeams(rec);
  let teamCount = 0;
  const leftTeams = teamSplit.left.map(
    (teamIndex) => (
      teamCount++,
      (
        <TeamTile
          key={`${rec.gameGuid}-${teamCount}`}
          recData={rec}
          teamIndex={teamIndex}
        />
      )
    ),
  );
  const rightTeams = teamSplit.right.map(
    (teamIndex) => (
      teamCount++,
      (
        <TeamTile
          key={`${rec.gameGuid}-${teamCount}`}
          recData={rec}
          teamIndex={teamIndex}
        />
      )
    ),
  );

  return (
    <div>
      {windowSize && windowSize.width >= 768 ? (
        // desktop layout
        <div>
          <div className="flex">
            {leftTeams}
            <div>
              <RecTitle gameTitle={rec.gameTitle || ""} />
              {showMap && <RecMap rec={rec} />}
            </div>
            {rightTeams}
          </div>
          <RecFooter rec={rec} />
        </div>
      ) : (
        // mobile layout
        <div>
          <div className="flex flex-col">
            <div className="flex flex-col items-center">
              <RecTitle gameTitle={rec.gameTitle || ""} />
              {showMap && <RecMap rec={rec} />}
            </div>
            <div className="mx-auto pt-2">
              {leftTeams}
              {rightTeams}
            </div>
          </div>
          <RecFooter rec={rec} />
        </div>
      )}
    </div>
  );
}
