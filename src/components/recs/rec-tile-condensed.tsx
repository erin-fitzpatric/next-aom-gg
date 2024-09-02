"use client";

import RecTitle from "./rec-title";
import RecFooter from "./rec-footer";
import { IRecordedGame } from "@/types/RecordedGame";
import { useTeams } from "@/hooks/useTeams";

interface RecTileProps {
  rec: IRecordedGame;
  showMap?: boolean;
}

export default function RecTileCondensed({
  rec,
  showMap = true,
}: RecTileProps) {
  const { leftTeams, rightTeams } = useTeams(rec);
  console.log(rec.gameTitle);
  return (
    <div className="flex flex-col gap-2">
      <RecTitle gameTitle={rec.gameTitle || ""} className="self-center" />
      <div className="flex">
        {leftTeams}
        <div className="self-center">VS</div>
        {rightTeams}
      </div>
      <RecFooter rec={rec} />
    </div>
  );
}
