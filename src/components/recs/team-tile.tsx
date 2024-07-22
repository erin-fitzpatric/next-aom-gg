import { majorGodIndexToData } from "@/types/MajorGods";
import { IPlayerData } from "@/types/MythRecs";
import Image from "next/image";

export default function TeamTile({ playerData }: { playerData: IPlayerData }) {
  const { name, civ } = playerData;
  const godData = majorGodIndexToData(civ);
  return (
    <div className="flex flex-col items-center my-auto px-2 w-32">
      <Image
        src={godData.portraitPath}
        alt={"super cool god description"}
        width={64}
        height={64}
        className="rounded-full border-2 border-amber-400"
      ></Image>
      <div className="text-center truncate w-30 font-medium">
        {name}
      </div>
      <div className="text-center truncate w-30 font-medium italic">
        Rank: 1450
      </div>
    </div>
  );
}
