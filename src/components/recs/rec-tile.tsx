"use client";

import TeamTile from "./team-tile";
import { randomMapNameToData } from "@/types/RandomMap";
import RecTitle from "./rec-title";
import RecMap from "./rec-map";
import RecFooter from "./rec-footer";
import { useContext } from "react";
import { WindowContext } from "../provider/window-provider";
import { IRecordedGame } from "@/types/RecordedGame";
import { splitTeams } from "@/server/teams";

export default function RecTile({ rec }: { rec: IRecordedGame }) {
  const windowSize = useContext(WindowContext);
  // TODO - process team data

  const mapData = randomMapNameToData(rec.gameMapName);
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
    )
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
    )
  );

  return (
    <div>
      {windowSize && windowSize.width >= 768 ? (
        // desktop layout
        <div>
          <div className="flex">
            {leftTeams}
            <div>
              <RecTitle gameTitle={rec.gameTitle} />
              <RecMap mapData={mapData} />
            </div>
            {rightTeams}
          </div>
          <RecFooter rec={rec} />
        </div>
      ) : (
        // mobile layout
        <div>
          <div className="flex flex-col">
            <div>
              <RecTitle gameTitle={rec.gameTitle} />
              <RecMap mapData={mapData} />
 
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
