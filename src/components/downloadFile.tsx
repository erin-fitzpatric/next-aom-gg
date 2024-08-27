"use client";

import { downloadS3File } from "@/server/services/aws";
import { Check, DownloadIcon } from "lucide-react";
import { useState } from "react";

export default function DownloadFile({ fileName }: { fileName: string }) {
  //  set state
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [filename, setFilename] = useState(fileName);

  // download s3 file from server
  const downloadHotkeys = async (key: string) => {
    setIsDownloading(true);
    const response = await downloadS3File({
      key,
      bucket: "aom-hotkeys",
      filename: key,
    });
    window.open(response.signedUrl, "_blank");
    setIsDownloading(false);
    setIsDownloaded(true);
  };

  return (
    <a className="cursor-pointer">
      {!isDownloaded ? (
        <DownloadIcon
          className="inline-block ml-2 text-primary"
          onClick={() => downloadHotkeys(filename)}
        />
      ) : (
        <Check className="text-primary pl-1" />
      )}
    </a>
  );
}
