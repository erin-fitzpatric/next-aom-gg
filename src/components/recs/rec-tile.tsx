import { downloadS3File } from "@/server/aws";
import { DownloadIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "../ui/use-toast";
import TeamTile from "./team-tile";
import { useEffect, useState } from "react";
import { MythRecs as MythRec } from "@/types/MythRecs";
import { randomMapNameToData } from "@/types/RandomMap";

export default function RecTile({ rec }: { rec: MythRec }) {
  const { gameGuid, playerData, mapName, createdAt } = rec;
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  async function handleRecDownload(key: string): Promise<void> {
    // TODO - add loading spinner
    console.log("downloading rec", key);
    try {
      const url = await downloadS3File(key);
      window.open(url, "_blank");
    } catch (err) {
      console.error("Error downloading rec", err);
      toast({
        title: "Error Downloading Rec",
        description: "Try again later",
      });
    }
  }

  // TODO - process team data


  const mapData = randomMapNameToData(mapName);

  return (
    <div>
      {screenSize.width >= 768 ? (
        <div>
          <div className="flex">
            <TeamTile playerData={playerData[1]} /> {/* TODO - make team dynamic */}
            <div>
              <div className="text-center text-xl text-prim font-semibold w-[240px] min-h-2-lines line-clamp-2">
                Mista 1v1 Fast Mythic
              </div>
              <Image
                src={mapData.imagePath}
                alt={mapData.name}
                width={240}
                height={240}
              ></Image>
            </div>
            <TeamTile playerData={playerData[2]} /> {/* TODO - make team dynamic */}
          </div>
          <div className="flex flex-row">
            <div>
              <p className="text-gold">Uploaded By:</p>
              <p>FitzBro</p> {/* TODO - add link to player profile */}
            </div>
            <div className="flex flex-row ml-auto mt-auto">
              <div px-2>
                <p>5</p>
              </div>
              <DownloadIcon
                onClick={() => handleRecDownload(gameGuid)}
                className="ml-1 cursor-pointer text-primary"
              />
            </div>
          </div>
        </div>
      ) : (
        <div>hello</div>
      )}
    </div>
  );
}
