import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { SpinnerWithText } from "../spinner";
import { toast } from "../ui/use-toast";
import { getMythRecs } from "@/server/controllers/mongo-controller";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useSession } from "next-auth/react";
import { SignIn } from "../sign-in";
import { Filters } from "@/types/Filters";

export type RecUploadFormProps = {
  setRecs: Dispatch<SetStateAction<any[]>>;
  filters: Filters;
};

export default function RecUploadForm({
  setRecs,
  filters,
}: RecUploadFormProps) {
  const [recFile, setRecFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { data: session } = useSession();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setRecFile(selectedFile);
      // Check if the file has a .mythrec extension
      if (selectedFile.name.toLowerCase().endsWith(".mythrec")) {
        setFileType("application/x-mythrec");
      } else {
        setFileType(selectedFile.type || "application/octet-stream");
      }
    }
  };

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
  };

  async function handleUploadFile(
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();
    if (!recFile) return;
    setIsUploading(true);

    try {
      // Step 1: Get the pre-signed URL
      const presignedUrlResponse = await fetch(
        `/api/getPresignedUrl?fileName=${encodeURIComponent(recFile.name)}&fileType=${encodeURIComponent(fileType)}`,
      );
      if (!presignedUrlResponse.ok) {
        throw new Error("Failed to get pre-signed URL");
      }
      const { signedUrl, key } = await presignedUrlResponse.json();

      // Step 2: Upload the file to S3
      const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        body: recFile,
        headers: {
          "Content-Type": fileType,
        },
        mode: "cors",
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file to S3");
      }

      // Step 3: Save metadata to your database
      const metadataResponse = await fetch("/api/recordedGames", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameTitle: fileName,
          s3Key: key,
        }),
      });

      if (metadataResponse.ok) {
        toast({
          title: "Success",
          description: "Rec uploaded successfully",
        });
        const mythRecs = await getMythRecs(0, filters);
        setRecs(mythRecs);
        setRecFile(null);
        setFileName("");
        setFileType("");
        // reset recUploadForm
        const form = document.getElementById(
          "recUploadForm",
        ) as HTMLFormElement;
        form.reset();
      } else if (metadataResponse.status === 400) {
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
    } catch (err) {
      console.error("Error uploading rec", err);
      toast({
        title: "Error Uploading Rec",
        description: "Try again later",
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Sheet>
      <SheetTrigger className="flex mx-auto" asChild>
        <Button className="flex mx-auto">Upload Recorded Game</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Upload Recorded Game</SheetTitle>
          <SheetDescription>
            Upload an AoM Retold recorded game to aom.gg! You can find recorded
            games in the following directory:
            <br />
            <code>
              C:\Users\FitzBro\Games\Age of Mythology Retold\yourSteamId\replays
            </code>
            <br />
            <br />
          </SheetDescription>
        </SheetHeader>
        {!session ? (
          <SheetDescription className="text-gold">
            <div className="flex flex-col items-center">
              <SignIn />
              <p className="font-semibold mt-2">
                Sign in to upload recordings!
              </p>
            </div>
          </SheetDescription>
        ) : (
          <form
            id="recUploadForm"
            onSubmit={handleUploadFile}
            className="flex mt-1 flex-col"
          >
            <input
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
            {isUploading ? (
              <div className="flex justify-center mt-4">
                <SpinnerWithText text={"Uploading..."} />
              </div>
            ) : (
              <Button type="submit" className="flex mx-auto mt-2">
                Upload
              </Button>
            )}
            <p className="mx-auto text-gold">(1vs1 Only for Now)</p>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
