import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";

export default function RecUploader() {
  const [recFile, setRecFile] = useState(null);
  const [fileName, setFileName] = useState("");

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

    // TODO - add UPLOADING spinner
    // TODO - implement Steam login and remove all of these prompts
    const userName = prompt("Enter your gamertag:");
    if (!userName) {
      alert("Name is required to upload");
      return;
    }

    // upload file
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
        // TODO - push inserted rec to state and revalidate
        toast({
          title: "Success",
          description: "Rec uploaded successfully",
        });
      } else if (response.status === 400) {
        toast({
          title: "Rec already uploaded",
          description: "Try again later",
        });
      } else {
        toast({
          title: "Error Uploading Rec",
          description: "Try again later",
        });
      }
      // setIsLoading(false);
    } catch (err: any) {
      console.error("Error uploading rec", err);
      toast({
        title: "Error Uploading Rec",
        description: "Try again later",
      });
      // setIsLoading(false);
    }
  }

  return (
    <>
      <div className="card-header">
        <h2>Recorded Games</h2>
      </div>
      <div className="mx-auto w-auto md:w-fit mt-4 bg-secondary p-4 rounded-xl outline-double text-gold ">
        <div className="text-center">
          <h3 className="text-white">Upload an AoM Retold Recorded Game</h3>
          <p>
            C:\Users\fitzbro\Games\Age of Mythology Retold
            Beta\yourSteamId\replays
          </p>
        </div>
        <form onSubmit={handleUploadFile} className="flex flex-col mt-1">
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
            placeholder="Enter game title"
            className="border-b border-gray-400 focus:outline-none focus:border-blue-500 px-2 py-1"
          />
        </form>
        <div className="flex">
          <Button type="submit" className="mx-auto mt-2">
            Upload
          </Button>
        </div>
      </div>
    </>
  );
}
