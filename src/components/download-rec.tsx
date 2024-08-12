import { DownloadIcon } from "lucide-react";
import { Spinner } from "./spinner";
import { SignInDialog } from "./sign-in-dialog-conent";
import { toast } from "./ui/use-toast";
import downloadMythRec from "@/server/controllers/download-rec-controller";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useState } from "react";
import { IRecordedGame } from "@/types/RecordedGame";

export default function DownloadRec({
  rec,
  setIsDownloaded,
}: {
  rec: IRecordedGame;
  setIsDownloaded: Dispatch<SetStateAction<boolean>>;
}) {
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: session } = useSession(); // get the client session

  async function handleRecDownload(rec: IRecordedGame): Promise<void> {
    setIsDownloading(true);
    try {
      const { signedUrl } = await downloadMythRec(rec);
      if (typeof window !== "undefined") {
        window.open(signedUrl, "_blank");
      }
      setIsDownloading(false);
      setIsDownloaded(true);
    } catch (err) {
      console.error("Error downloading rec", err);
      toast({
        title: "Error Downloading Rec",
        description: "Try again later",
      });
      setIsDownloading(false);
    }
  }

  return (
    <>
      {session ? (
        !isDownloading ? (
          <DownloadIcon
            onClick={() => handleRecDownload(rec)}
            className="ml-1 cursor-pointer text-primary"
          />
        ) : (
          <div className="flex items-center gap-3">
            <Spinner className="text-primary" />
            <span className="text-primary"></span>
          </div>
        )
      ) : (
        // Prompt user to sign in if they try to download a rec without being signed in
        <SignInDialog
          triggerButton={
            <DownloadIcon className="cursor-pointer text-primary" />
          }
        />
      )}
    </>
  );
}
