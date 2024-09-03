import { IRecordedGame } from "@/types/RecordedGame";
import { downloadS3RecFile } from "../services/aws";
import { incrementDownloadCount } from "../services/mongo-service";

export interface MythRecDownloadLink {
  signedUrl: string;
}

export default async function downloadMythRec(
  rec: IRecordedGame
): Promise<MythRecDownloadLink> {
  const key = rec.gameGuid
  try {
    const downloadUrl = await downloadS3RecFile(rec);
    await incrementDownloadCount(key);
    return downloadUrl;
  } catch (err) {
    throw new Error("Error downloading rec");
  }
}
