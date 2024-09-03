import { RandomMapData, randomMapNameToData } from "@/types/RandomMap";
import Image from "next/image";
import { IRecordedGame } from "@/types/RecordedGame";
import RecModal from "./rec-modal";

function formatGameLength(seconds: number): string {
  // Round off any floating-point seconds
  const roundedSeconds = Math.round(seconds);

  // Calculate hours, minutes, and seconds
  const hours = Math.floor(roundedSeconds / 3600);
  const minutes = Math.floor((roundedSeconds % 3600) / 60);
  const remainingSeconds = roundedSeconds % 60;

  // Format minutes and seconds with leading zeros if necessary
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

  // Construct the formatted time string
  if (hours > 0) {
    return `${hours}:${formattedMinutes}:${formattedSeconds}`;
  } else {
    return `${formattedMinutes}:${formattedSeconds}`;
  }
}

type IRecMapParams = {
  rec: IRecordedGame;
};

export default function RecMap({ rec }: IRecMapParams) {
  const mapData = randomMapNameToData(rec.gameMapName);
  return (
    <>
      <Image
        src={mapData.imagePath}
        alt={mapData.name}
        width={240}
        height={240}
        priority
      ></Image>
      <div className="flex justify-center italic">
        <p>{mapData.name}</p>
      </div>
      {/* modal */}
      <RecModal rec={rec} mapData={mapData} />
    </>
  );
}
