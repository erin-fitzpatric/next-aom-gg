import Image from "next/image";
import { useState, useEffect } from "react";
import { Skeleton } from "../ui/skeleton";
import Loading from "../loading";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FlameIcon } from "lucide-react";
import UnderConstruction from "./under-construction";

export default function HeatMaps() {
  const [heatMaps, setHeatMaps] = useState<any[]>([]);

  // Fetch heatmaps on component mount
  useEffect(() => {
    fetchHeatMaps();
  }, []);

  async function fetchHeatMaps() {
    const url = "/api/stats/heatmaps";
    const response = await fetch(url);
    const data = await response.json();
    setHeatMaps(data.files);
  }

  return (
    <div>
      {heatMaps.length === 0 ? (
        <Skeleton className="h-96">
          <Loading text="Fetching favor from the gods..." />
        </Skeleton>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-gold flex items-center mx-auto text-3xl">
              <FlameIcon className="text-red-500" size={32} /> Heat Maps
            </CardTitle>
          </CardHeader>

          <CardContent className="mx-auto flex justify-center items-center flex-col space-y-4">
            {heatMaps.map((heatMap: any) => (
              <Image
                src={heatMap.base64Data}
                alt="heatmap image"
                height={1080}
                width={1080}
                key={heatMap.key}
                className="w-auto h-auto border-solid border-2 border-yellow-500"
              />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
