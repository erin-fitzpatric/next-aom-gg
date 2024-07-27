"use client";

import downloadMythRec from "@/server/controllers/download-rec-controller";
import { DownloadIcon } from "lucide-react";
import { toast } from "../ui/use-toast";
import { IRecordedGame } from "@/types/RecordedGame";

export default function RecFooter({ rec }: { rec: IRecordedGame }) {
  const { uploadedBy, downloadCount } = rec;


  async function handleRecDownload(rec: IRecordedGame): Promise<void> {
    
    // TODO - add loading spinner
    console.log("downloading rec", rec.gameGuid);
    try {
      const { signedUrl } = await downloadMythRec(rec);
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
      <div className="w-48 overflow-hidden">
        <p className="text-gold">Uploaded By:</p>
        <p className="truncate">{uploadedBy}</p> {/* TODO - add link to player profile */}
      </div>
      <div className="flex flex-row ml-auto mt-auto">
        <div className="px-2">
          <p>{downloadCount}</p>
        </div>
        <DownloadIcon
          onClick={() => handleRecDownload(rec)}
          className="ml-1 cursor-pointer text-primary"
        />
      </div>
    </div>
  );
}
