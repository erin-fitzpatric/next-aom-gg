"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
import RecFilters from "./filters/rec-filters";
import { Filters } from "@/types/Filters";

export default function RecordedGames() {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [recs, setRecs] = useState<any[]>([]);
  const [recFile, setRecFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [filters, setFilters] = useState<Filters>({});
  const initialFetch = useRef(true);
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

    const userName = prompt("Enter your gamertag:");
    if (!userName) {
      alert("Name is required to upload");
      return;
    }
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", recFile);
      formData.append("userName", userName);
      formData.append("gameTitle", fileName);

      const response = await fetch("/api/recordedGames", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Rec uploaded successfully",
        });
        const mythRecs = await getMythRecs(0);
        setRecs(mythRecs);
      } else if (response.status === 400) {
        toast({
          title: "Rec Already Uploaded",
          description:
            "This rec has already been uploaded - someone beat you to it!",
        });
      } else {
        toast({
          title: "Error Uploading Rec",
          description: "Try again later",
        });
      }
      setIsUploading(false);
    } catch (err) {
      console.error("Error uploading rec", err);
      toast({
        title: "Error Uploading Rec",
        description: "Try again later",
      });
      setIsUploading(false);
    }
  }

  const fetchRecs = useCallback(async (pageNum: number, filters?: Filters) => {
    const mythRecs = await getMythRecs(pageNum, filters);

    if (mythRecs.length === 0) {
      setHasMore(false);
      setIsLoading(false);
      return;
    }

    setRecs((prevRecs) => [...prevRecs, ...mythRecs]);
    setIsLoading(false);
  }, []);

  const handleScroll = useCallback(() => {
    if (isLoading || !hasMore) return;
    const scrollPosition = window.scrollY + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;
    if (pageHeight - scrollPosition <= 300) {
      setIsLoading(true);
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchRecs(nextPage, filters);
    }
  }, [isLoading, hasMore, currentPage, fetchRecs, filters]);

  useEffect(() => {
    if (initialFetch.current) {
      fetchRecs(0);
      initialFetch.current = false;
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchRecs, handleScroll]);

  // Reenable infinite scroll when filters change
  useEffect(() => {
    setHasMore(true);
  }, [filters]);

  return (
    <div>
      <div className="card-header">
        <h2>Recorded Games</h2>
      </div>
      {/* Upload Recs */}
      <div className="mx-auto w-fit mt-4 bg-secondary p-4 rounded-xl outline-double text-gold">
        <div className="flex gap-2 text-center">
          <h3 className="text-white">Upload an AoM Retold Recorded Game</h3>
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className="cursor-pointer hover:text-primary" />
            </TooltipTrigger>
            <TooltipContent>
              <p>
              C:\Users\efitz\Games\Age of Mythology Retold Playtest\yourSteamId\replays
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
          {/* add spinner when uploading */}
          {isUploading ? (
            <div className="flex justify-center mt-4">
              <SpinnerWithText text={"Uploading..."} />
            </div>
          ) : (
            <Button type="submit" className="flex mx-auto mt-2">
              Upload
            </Button>
          )}
          <p className="mx-auto">(1vs1 Only for Now)</p>
        </form>
      </div>
      {/* filters */}
      <RecFilters
        setRecs={setRecs}
        setIsLoading={setIsLoading}
        filters={filters}
        setFilters={setFilters}
      />
      {recs.length === 0 && !initialFetch ? (
        <div className="flex justify-center mt-4">
          <Card className="p-4 w-full">
            <p className="flex justify-center">No recorded games found!</p>
          </Card>
        </div>
      ) : (
        <Card className="p-4">
          {/* Replay Gallery */}
          <div>
            <div className="flex flex-row flex-wrap justify-center">
              {recs?.map((rec) => (
                <Card
                  key={rec.gameGuid}
                  className="bg-secondary rounded-lg m-1 p-2 flex w-fit"
                >
                  <div>
                    <RecTile
                      key={`rec-tile-${rec.gameGuid}`}
                      rec={rec}
                    ></RecTile>
                  </div>
                </Card>
              ))}
            </div>
            {isLoading && (
              <div className="flex justify-center mt-4">
                <SpinnerWithText text={"Loading recorded games..."} />
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
