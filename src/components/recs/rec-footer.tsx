"use client";

import downloadMythRec from "@/server/controllers/download-rec-controller";
import { DownloadIcon } from "lucide-react";
import { toast } from "../ui/use-toast";
import { useEffect, useState } from "react";
import { IRecordedGame } from "@/types/RecordedGame";

export default function RecFooter({ rec }: { rec: IRecordedGame }) {
  const { gameGuid, uploadedBy, downloadCount } = rec;


  async function handleRecDownload(key: string): Promise<void> {
    
    // TODO - add loading spinner
    console.log("downloading rec", key);
    try {
      const { signedUrl } = await downloadMythRec(key);
      if (typeof window !== "undefined") {
        window.open(signedUrl, "_blank");
      }
    } catch (err) {
      console.error("Error downloading rec", err);
      toast({
        title: "Error Downloading Rec",
        description: "Try again later",
      });
    }
  }

  return (
    <div className="flex flex-row">
      <div>
        <p className="text-gold">Uploaded By:</p>
        <p>{uploadedBy}</p> {/* TODO - add link to player profile */}
      </div>
      <div className="flex flex-row ml-auto mt-auto">
        <div className="px-2">
          <p>{downloadCount}</p>
        </div>
        <DownloadIcon
          onClick={() => handleRecDownload(gameGuid)}
          className="ml-1 cursor-pointer text-primary"
        />
      </div>
    </div>
  );
}
