import Image from "next/image";
import { Match as MatchType } from "@/types/Match";

export function Map({ mapData }: { mapData: MatchType["mapData"] }) {
  return (
    <div>
      {/* Map */}
      {mapData && (
        <Image
          src={mapData.imagePath}
          alt={mapData.name}
          width={120}
          height={120}
        />
      )}
    </div>
  );
}
