"use client";

import { useState, useEffect, useContext } from "react";
import { SpinnerWithText } from "../spinner";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { useToast } from "../ui/use-toast";
import { Input } from "../ui/input";
import RecTile from "./rec-tile";
import { getMythRecs } from "@/server/controllers/mongo-controller";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { IRecordedGame } from "@/types/RecordedGame";

export default function RecordedGames() {
  const [recs, setRecs] = useState<IRecordedGame[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [recFile, setRecFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const { toast } = useToast();

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files[0];
    setRecFile(selectedFile);
    setFileName(selectedFile.name);
  };

  const handleFileNameChange = (e: any) => {
    setFileName(e.target.value);
  };

  async function handleUploadFile(e: any): Promise<void> {
    e.preventDefault();
    if (!recFile) return;

    // todo - implement Steam login and remove all of these prompts
    const userName = prompt("Enter your gamertag:");
    if (!userName) {
      alert("Name is required to upload");
      return;
    }
    setIsLoading(true);

    // upload file
    try {
      const formData = new FormData();
      formData.append("file", recFile);
      formData.append("userName", userName);

      const response = await fetch("/api/recordedGames", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Rec uploaded successfully",
        });
        // todo - update state and revalidate
      } else {
        toast({
          title: "Error Uploading Rec",
          description: "Try again later",
        });
      }

      setIsLoading(false);
    } catch (err) {
      console.error("Error uploading rec", err);
      toast({
        title: "Error Uploading Rec",
        description: "Try again later",
      });
      setIsLoading(false);
    }
  }

  async function fetchRecs(): Promise<void> {
    if (isFetching) return;
    setIsFetching(true);
    console.log("fetching recs");
    try {
      // load next page of recs
      const mythRecs = await getMythRecs(page);
      if (mythRecs.length === 0) {
        console.log("no more recs");
        setIsLoading(false);
        setIsFetching(false);
        setPage(-1);
        return;
      }
      setRecs((recs) => [...recs, ...mythRecs]);
      setIsLoading(false);
      setIsFetching(false);
    } catch (err) {
      console.error("Error fetching recs", err);
      setIsLoading(false);
      setIsFetching(false);
      toast({
        title: "Error Fetching Recs",
        description: "Try again later",
      });
    }
  }

  useEffect(() => {
    fetchRecs();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;
      if (pageHeight - scrollPosition <= 300 && page !== -1) {
        if (isLoading) return;
        setIsLoading(true);
        fetchRecs();
        setPage((prevPage) => prevPage + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setPage, isLoading]);

  return (
    <Card className="p-4">
      <div className="card-header">
        <h2>Recorded Games</h2>
      </div>
      <div className="mx-auto w-fit mt-4 bg-secondary p-4 rounded-xl outline-double text-gold">
        <div className="flex gap-2 text-center">
          <h3 className="text-white">Upload an AoM Retold Recorded Game</h3>
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className="cursor-pointer hover:text-primary" />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                C:\Users\fitzbro\Games\Age of Mythology
                RetoldBeta\yourSteamId\replays
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        <form onSubmit={handleUploadFile} className="flex mt-1 flex-col">
          <Input
            type="file"
            onChange={handleFileChange}
            accept=".mythrec"
            className="mr-2"
          />
          <input
            type="text"
            value={fileName}
            onChange={handleFileNameChange}
            placeholder="Enter file name"
            className="border-b border-gray-400 focus:outline-none focus:border-blue-500 px-2 py-1"
          />
          <Button type="submit" className="flex mx-auto mt-2">
            Upload
          </Button>
        </form>
      </div>
      <div className="mt-4">
        {isLoading ? (
          <SpinnerWithText text={"Loading recorded games..."} />
        ) : (
          <div className="flex flex-row flex-wrap justify-center">
            {recs?.map(
              (rec) => (
                console.log("red", rec),
                (
                  <Card
                    key={rec.gameGuid}
                    className="bg-secondary rounded-lg m-1 p-2 flex w-fit"
                  >
                    <div>
                      <RecTile rec={rec}></RecTile>
                    </div>
                  </Card>
                )
              )
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
