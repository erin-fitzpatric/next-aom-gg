import { RandomMapData } from "@/types/RandomMap";
import Image from "next/image";

export default function RecMap({mapData}: {mapData: RandomMapData}) {
  return (
    <>
      <Image
        src={mapData.imagePath}
        alt={mapData.name}
        width={240}
        height={240}
      ></Image>
    </>
  );
}
