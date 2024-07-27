import { teamIndexToPlayerData } from "@/server/teams";
import { majorGodIndexToData } from "@/types/MajorGods";
import { IRecordedGame } from "@/types/RecordedGame";
import { RecordedGamePlayerMetadata } from "@/types/RecordedGameParser";
import Image from "next/image";

function PlayerTile(playerData: RecordedGamePlayerMetadata, gameGuid: string) {
  const { name, civ, id } = playerData;
  const godData = majorGodIndexToData(civ);
  return (
    <div
      className="flex flex-col items-center my-auto px-2 w-32"
      key={`${gameGuid}-player-${id}`}
    >
      <Image
        src={godData.portraitPath}
        alt={godData.name}
        width={64}
        height={64}
        className="rounded-full border-2 border-amber-400"
      ></Image>
      <div
        className="text-center truncate font-medium w-full overflow-hidden"
        title={name}
      >
        {name}
      </div>

      <div className="text-center truncate w-30 font-medium italic">
        Rank: TBD
      </div>
    </div>
  );
}

export default function TeamTile({
  recData,
  teamIndex,
}: {
  recData: IRecordedGame;
  teamIndex: number;
}) {
  const { gameGuid } = recData;
  const playerData = teamIndexToPlayerData(recData, teamIndex);
  // The format of the teams in the recs seems to be a problem and needs more real recs to work on - in particular, what to do with a value of -1
  // and just doing this should hopefully push things back towards how they were before
  //return PlayerTile(playerData[0]);

  const teamName = `Team ${1 + teamIndex}`;
  let teamHeader = undefined;
  if (recData.teams.length >= 3) {
    teamHeader = (
      <div className="text-center truncate w-30 font-medium">{teamName}</div>
    );
  }

  return (
    <div className="flex flex-col items-center my-auto px-2 w-32">
      {teamHeader}
      <div>
        {playerData.map((thisPlayer) => PlayerTile(thisPlayer, gameGuid))}
      </div>
    </div>
  );
}
