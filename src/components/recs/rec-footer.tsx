"use client";

import { IRecordedGame } from "@/types/RecordedGame";
import DownloadRec from "../download-rec";
import { useState } from "react";
import { Check, LinkIcon } from "lucide-react";
import { toast } from "../ui/use-toast";

export default function RecFooter({ rec }: { rec: IRecordedGame }) {
  const [isDownloaded, setIsDownloaded] = useState(false);

  const { uploadedBy, downloadCount, createdAt } = rec;
  const formattedUploadDate = `${
    createdAt.getMonth() + 1
  }/${createdAt.getDate()}/${String(createdAt.getFullYear()).slice(-2)}`;

  const handleLinkClick = (id: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const link = `${baseUrl}/recs/?search=${id}&build=${rec.buildNumber}`;
  
    // Copy the link to the clipboard
    navigator.clipboard.writeText(link).then(() => {
      toast({
        title: "Link Copied to Clipboard!",
        description: link,
        duration: 3000
      });
    }).catch(err => {
      console.error("Failed to copy the link:", err);
      toast({
        title: "Error Copying Link",
        description: "Try again later",
      });
    });
  };

  return (
    <div className="flex flex-row justify-between">
      <div className="w-48 overflow-hidden">
        <p className="text-gold">Uploaded By:</p>
        <p className="truncate">{uploadedBy}</p>
      </div>
      <div className="flex flex-col justify-between items-end ml-auto">
        <div className="mb-1">
          <p className="text-gold">{formattedUploadDate}</p>
        </div>
        <div className="flex flex-row items-center">
          <div className="px-2">
            <p>{downloadCount}</p>
          </div>
          {!isDownloaded ? (
            <DownloadRec rec={rec} setIsDownloaded={setIsDownloaded} />
          ) : (
            <Check className="text-primary" />
          )}
          <LinkIcon
            className="ml-2 text-primary cursor-pointer hover:text-blue-500"
            onClick={() => handleLinkClick(rec.gameGuid)}
          />
        </div>
      </div>
    </div>
  );
}
