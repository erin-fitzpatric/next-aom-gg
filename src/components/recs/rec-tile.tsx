"use client";

import TeamTile from "./team-tile";
import { randomMapNameToData } from "@/types/RandomMap";
import RecTitle from "./rec-title";
import RecMap from "./rec-map";
import RecFooter from "./rec-footer";
import { useContext, useEffect } from "react";
import { WindowContext } from "../provider/window-provider";
import { IRecordedGame } from "@/types/RecordedGame";

export default function RecTile({ rec }: { rec: IRecordedGame }) {
  const windowSize = useContext(WindowContext);

  // TODO - process team data

  const mapData = randomMapNameToData(rec.gameMapName);

  return (
    <div>
      {windowSize && windowSize.width >= 768 ? (
        <div>
          <div className="flex">
            <TeamTile playerData={rec.playerData[1]} />{" "}
            {/* TODO - make team dynamic */}
            <div>
              <RecTitle gameTitle={rec.gameTitle} />
              <RecMap mapData={mapData} />
            </div>
            <TeamTile playerData={rec.playerData[2]} />{" "}
            {/* TODO - make team dynamic */}
          </div>
          <RecFooter rec={rec} />
        </div>
      ) : (
        <div>
          <div className="flex flex-col">
            <div>
              <RecTitle gameTitle={rec.gameTitle} />
              <RecMap mapData={mapData} />
            </div>
            <div className="mx-auto pt-2">
              <TeamTile playerData={rec.playerData[1]} />{" "}
              <TeamTile playerData={rec.playerData[2]} />{" "}
            </div>
          </div>
          <RecFooter rec={rec} />
        </div>
      )}
    </div>
  );
}
