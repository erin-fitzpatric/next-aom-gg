"use client";

import TeamTile from "./team-tile";
import { MythRec as MythRec } from "@/types/MythRecs";
import { randomMapNameToData } from "@/types/RandomMap";
import RecTitle from "./rec-title";
import RecMap from "./rec-map";
import RecFooter from "./rec-footer";
import { useContext, useEffect } from "react";
import { WindowContext } from "../provider/window-provider";

export default function RecTile({ rec }: { rec: MythRec }) {
  const { playerData, mapName, gameTitle } = rec;
  const windowSize = useContext(WindowContext);

  // TODO - process team data

  const mapData = randomMapNameToData(mapName);

  return (
    <div>
      {windowSize && windowSize.width >= 768 ? (
        <div>
          <div className="flex">
            <TeamTile playerData={playerData[1]} />{" "}
            {/* TODO - make team dynamic */}
            <div>
              <RecTitle gameTitle={gameTitle} />
              <RecMap mapData={mapData} />
            </div>
            <TeamTile playerData={playerData[2]} />{" "}
            {/* TODO - make team dynamic */}
          </div>
          <RecFooter rec={rec} />
        </div>
      ) : (
        <div>
          <div className="flex flex-col">
            <div>
              <RecTitle gameTitle={gameTitle} />
              <RecMap mapData={mapData} />
            </div>
            <div className="mx-auto pt-2">
              <TeamTile playerData={playerData[1]} />{" "}
              <TeamTile playerData={playerData[2]} />{" "}
            </div>
          </div>
          <RecFooter rec={rec} />
        </div>
      )}
    </div>
  );
}
