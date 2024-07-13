"use client";

import { uploadS3Rec, listS3Recs, downloadS3File } from "@/api/aws";
import { useState, useEffect } from "react";
import { SpinnerWithText } from "./spinner";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useToast } from "./ui/use-toast";
import { DownloadIcon } from "lucide-react";
import { Input } from "./ui/input";

export default function RecordedGames() {
  const [recs, setRecs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [continuationToken, setContinuationToken] = useState<
    string | undefined
  >(undefined);
  const [recFile, setRecFile] = useState(null);
  const [fileName, setFileName] = useState('');

  const { toast } = useToast();

  const recBucket = process.env.NEXT_PUBLIC_S3_REC_BUCKET_NAME;
  const settingsBucket = process.env.NEXT_PUBLIC_S3_SETTINGS_BUCKET_NAME;

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
    if (!recBucket) {
      console.error("S3 recBucket missing");
      return;
    }

    // todo - implement Steam login and remove all of these prompts
    const userName = prompt('Enter your gamertag:');
    if (!userName) {
      alert('Name is required to upload');
      return;
    }

    setIsLoading(true);
    // set form data
    const formData = new FormData();
    formData.append("file", recFile);
    formData.append('uploadedBy', userName);
    formData.append('fileName', fileName);

    // upload file
    console.log("uploading rec to s3");
    try {
      await uploadS3Rec(formData);

      toast({
        title: "Success",
        description: "Rec uploaded successfully",
      });
      setIsLoading(false);
    } catch (err) {
      console.error("Error uploading rec", err);
      setIsLoading(false);
    }
  }

  async function handleRecDownload(key: string): Promise<void> {
    // TODO - add loading spinner

    console.log("downloading rec", key);
    if (!recBucket) {
      console.error("S3 recBucket missing");
      return;
    }
    try {
      const url = await downloadS3File(key, recBucket);
      window.open(url, "_blank");
    } catch (err) {
      console.error("Error downloading rec", err);
      toast({
        title: "Error Downloading Rec",
        description: "Try again later",
      });
    }
  }

  // async function handleSettingsDownload(): Promise<void> {
  //   console.log("downloading aom settings");
  //   if (!settingsBucket) {
  //     console.error("S3 settings bucket missing");
  //     return;
  //   }
  //   const key = "FitzLocalKeybindings.xml";
  //   try {
  //     const url = await downloadS3File(key, settingsBucket);
  //     window.open(url, "_blank");
  //   } catch (err) {
  //     console.error("Error downloading settings", err);
  //     toast({
  //       title: "Error Downloading Settings",
  //       description: "Try again later",
  //     });
  //   }
  // }

  useEffect(() => {
    async function getRecs(): Promise<void> {
      console.log("fetching recs");
      setIsLoading(true);
      try {
        const { contents, nextContinuationToken } = await listS3Recs();
        setContinuationToken(nextContinuationToken);
        setRecs(contents);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching recs", err);
        setIsLoading(false);
        toast({
          title: "Error Fetching Recs",
          description: "Try again later",
        });
      }
    }
    getRecs();
  }, [toast]);

  return (
    <Card className="p-4">
      <div className="card-header">
        <h2>Recorded Games</h2>
      </div>
      <div className="mx-auto w-fit mt-4 bg-secondary p-4 rounded-xl outline-double text-gold">
        <div className="text-center">
          <h3 className="text-white">Upload an AoM Retold Recorded Game</h3>
          <p>
            C:\Users\fitzbro\Games\Age of Mythology Retold Beta\yourSteamId\replays
          </p>
        </div>
        <form onSubmit={handleUploadFile} className="flex mt-1">
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
          <Button type="submit" className="mx-2">
            Upload
          </Button>
        </form>
      </div>
      <div className="mt-4">
        {isLoading ? (
          <SpinnerWithText text={"Loading recorded games..."} />
        ) : (
          <div>
            {recs?.map((rec) => (
              <div
                key={rec.Key}
                className="cursor-pointer bg-secondary rounded-lg m-1 p-2 flex"
              >
                <div key={rec.Key}>{rec.Key}</div>
                <DownloadIcon
                  onClick={() => handleRecDownload(rec.Key)}
                  className="ml-2"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
