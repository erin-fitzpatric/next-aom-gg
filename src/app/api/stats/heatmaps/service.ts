import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";

export async function fetchHeatMaps() {
  const credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };

  const s3Client = new S3Client([
    {
      region: process.env.AWS_REGION,
      credentials,
    },
  ]);

  const listParams = {
    Bucket: "aom-stats",
    Prefix: "heatmaps/latest/", // Prefix for the folder
  };

  try {
    // List all objects in the folder
    const listCommand = new ListObjectsV2Command(listParams);
    const listData = await s3Client.send(listCommand);

    if (!listData.Contents || listData.Contents.length === 0) {
      throw new Error("No files found in the specified folder.");
    }

    // Filter out the folder itself (any key that ends with '/')
    const filteredContents = listData.Contents.filter(
      (object) => object.Key && !object.Key.endsWith("/")
    );

    // Loop through each object (file) and download it
    const downloadedFiles = await Promise.all(
      filteredContents.map(async (object) => {
        const getObjectParams = {
          Bucket: "aom-stats",
          Key: object.Key!,
        };
        const getCommand = new GetObjectCommand(getObjectParams);
        const data = await s3Client.send(getCommand);

        // Convert data.Body (stream) to base64 string
        const bodyBase64 = await streamToBase64(data.Body as Readable);
        const mimeType = data.ContentType || "image/jpeg"; // Adjust the MIME type if necessary

        return {
          key: object.Key,
          base64Data: `data:${mimeType};base64,${bodyBase64}`,
        };
      })
    );

    return {
      files: downloadedFiles,
    };
  } catch (err: any) {
    throw new Error(`Error downloading files: ${err.message}`);
  }
}

// Helper function to convert stream to base64 string
async function streamToBase64(stream: Readable): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => {
      const buffer = Buffer.concat(chunks);
      const base64 = buffer.toString("base64");
      resolve(base64);
    });
  });
}
