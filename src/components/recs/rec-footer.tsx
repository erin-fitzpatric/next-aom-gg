"use client";

import { IRecordedGame } from "@/types/RecordedGame";
import DownloadRec from "../download-rec";
import { useState } from "react";
import { Check } from "lucide-react";

export default function RecFooter({ rec }: { rec: IRecordedGame }) {
  const [isDownloaded, setIsDownloaded] = useState(false);

  const { uploadedBy, downloadCount, createdAt } = rec;
  const formattedUploadDate = `${
    createdAt.getMonth() + 1
  }/${createdAt.getDate()}/${String(createdAt.getFullYear()).slice(-2)}`;
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
        </div>
      </div>
    </div>
  );
}
