import { downloadS3File } from "../services/aws";
import { incrementDownloadCount } from "../services/mongo-service";

export interface MythRecDownloadLink {
  signedUrl: string;
}

export default async function downloadMythRec(key: string): Promise<MythRecDownloadLink> {
  try {
    const downloadUrl = await downloadS3File(key);
    await incrementDownloadCount(key);
    return downloadUrl;
  } catch (err) {
    throw new Error("Error downloading rec");
  }
}
