"use client";

import { useState, useEffect } from "react";
import { SpinnerWithText } from "../spinner";
import { Card } from "../ui/card";
import { useToast } from "../ui/use-toast";
import RecTile from "./rec-tile";
import { getMythRecs } from "@/server/controllers/mongo-controller";
import RecUploader from "./rec-upload";

export default function RecordedGames() {
  const [recs, setRecs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number | undefined>(undefined);

  const { toast } = useToast();

  const [screenSize, setScreenSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
  }, []);

  useEffect(() => {
    // fetch recs
    async function getRecs(): Promise<void> {
      console.log("fetching recs");
      setIsLoading(true);
      try {
        // load first page of recs on page load
        const mythRecs = await getMythRecs();
        setPage(1);
        setRecs(mythRecs);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching recs", err);
        setIsLoading(false);
        toast({
          title: "Error Fetching Recs",
          description: "Try again later",
        });
      }
    }
    getRecs();

    // screen resizing
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
    }

    // Clean up the event listener on component unmount
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, [toast]);

  return (
    <Card className="p-4">
      <div>
        <RecUploader />
      </div>
      <div className="mt-4">
        {isLoading ? (
          <SpinnerWithText text={"Loading recorded games..."} />
        ) : (
          <div className="flex flex-row flex-wrap justify-center">
            {recs?.map((rec) => (
              <Card
                key={rec.Key}
                className="bg-secondary rounded-lg m-1 p-2 flex w-fit"
              >
                <div key={rec.Key}>
                  <RecTile rec={rec} screenSize={screenSize}></RecTile>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
