"use client";
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
import { Dispatch, SetStateAction, useState } from "react";
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
  const [isUploading, setIsUploading] = useState(false);
  const { data: session } = useSession(); // get the client session

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile?.name) return;
    setRecFile(selectedFile);
  };

  const handleFileNameChange = (e: any) => {
    setFileName(e.target.value);
  };

  const uploadFileInChunks = async (file: File): Promise<Response> => {
    const chunkSize = 1024 * 1024; // 1MB
    const totalChunks = Math.ceil(file.size / chunkSize);
    let response: Response | undefined; // Define response here

    for (let chunkNumber = 0; chunkNumber < totalChunks; chunkNumber++) {
      const chunk = file.slice(
        chunkNumber * chunkSize,
        (chunkNumber + 1) * chunkSize
      );

      const formData = new FormData();
      formData.append("file", chunk);
      formData.append("chunkNumber", (chunkNumber + 1).toString()); // Convert number to string
      formData.append("totalChunks", totalChunks.toString()); // Convert number to string
      formData.append("gameTitle", file.name);

      try {
        response = await fetch("/api/recordedGames", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Chunk ${chunkNumber + 1} failed:`, errorText);
          throw new Error(`Chunk ${chunkNumber + 1} upload failed`);
        } else {
          console.log(`Chunk ${chunkNumber + 1} uploaded successfully.`);
        }
      } catch (error) {
        console.error(`Error uploading chunk ${chunkNumber + 1}:`, error);
        throw error; // Re-throw error to stop further execution
      }
    }

    // Return the response after the last chunk is uploaded
    if (!response) {
      throw new Error("No response received after file upload");
    }
    return response;
  };

  async function handleUploadFile(e: any): Promise<void> {
    e.preventDefault();
    if (!recFile) return;
    setIsUploading(true);

    try {
      // Upload file in chunks and get the final response
      const response = await uploadFileInChunks(recFile);

      if (response.ok) {
        toast({
          title: "Success",
          description: "Rec uploaded successfully",
        });

        // TODO - This needs to be called with filters
        const mythRecs = await getMythRecs(0, filters);
        setRecs(mythRecs);

        // Reset form and file state
        setRecFile(null);
        setFileName("");
        const form = document.getElementById(
          "recUploadForm"
        ) as HTMLFormElement;
        form.reset();
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
