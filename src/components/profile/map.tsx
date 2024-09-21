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
          width={64}
          height={64}
          className="xl:block hidden"
        />
      )}
    </div>
  );
}
