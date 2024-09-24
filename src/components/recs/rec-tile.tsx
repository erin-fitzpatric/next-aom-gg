import RecTitle from "./rec-title";
import RecMap from "./rec-map";
import RecFooter from "./rec-footer";
import { useContext, useState } from "react";
import { WindowContext } from "../provider/window-provider";
import { IRecordedGame } from "@/types/RecordedGame";
import { useTeams } from "@/hooks/useTeams";
import { Filters } from "@/types/Filters";
import RecEdit from "../RecEditSheet";

interface RecTileProps {
  id: string;
  rec: IRecordedGame;
  showMap?: boolean;
  refetchRecs: (filters: Filters) => void;
  filters: Filters;
}

export default function RecTile({ id, rec, showMap = true,refetchRecs, filters }: RecTileProps) {
  const windowSize = useContext(WindowContext);
  const { leftTeams, rightTeams } = useTeams(rec);
  const recGameAuthor = id === rec.uploadedByUserId;
  
  return (
    <div>
      {windowSize && windowSize.width >= 768 ? (
        // desktop layout
        <div>
          <div className="flex">
            <div className="flex mt-9">{leftTeams}</div>
            <div>
              <RecTitle gameTitle={rec.gameTitle || ""} />
              {showMap && <RecMap rec={rec} />}
            </div>
            <div className="flex flex-col">
              <div className="flex justify-end mt-2 mr-2">
                {!recGameAuthor && <RecEdit
                    id={id}
                    gameTitle={rec.gameTitle || ""}
                    gameGuid={rec.gameGuid}
                    refetchRecs={refetchRecs}
                    filters={filters}
                  />}
              </div>
              {rightTeams}
            </div>
          </div>
          <RecFooter rec={rec} />
        </div>
      ) : (
        // mobile layout
        <div className="relative">
      <div className="flex flex-col">
        <div className="flex flex-col items-center">
          <div className="relative w-full pl-5">
            <RecTitle gameTitle={rec.gameTitle || ""} />
              {recGameAuthor && <RecEdit
                id={id}
                gameTitle={rec.gameTitle || ""}
                gameGuid={rec.gameGuid}
                refetchRecs={refetchRecs}
                filters={filters}
              />}
          </div>
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