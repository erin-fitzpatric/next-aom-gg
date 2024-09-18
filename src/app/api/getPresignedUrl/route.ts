// pages/api/getPresignedUrl.ts
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "@/auth";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const GET = async function GET(req: Request) {
  if (req.method !== "GET") {
    return Response.json({ status: 405, error: "Method not allowed" });
  }

  // Check if user is authenticated
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ status: 401, error: "Not authenticated" });
  }

  const userId = session.user.id;
  const { searchParams } = new URL(req.url);
  const fileName = searchParams.get("fileName");
  const fileType = searchParams.get("fileType");

  if (!fileName || !fileType) {
    return Response.json({
      status: 400,
      error: "fileName and fileType are required",
    });
  }

  const key = `${userId}/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_S3_REC_BUCKET_NAME,
    Key: key,
    ContentType: fileType,
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    return Response.json({ status: 200, signedUrl, key });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return Response.json({
      status: 500,
      error: "Failed to generate signed URL",
    });
  }
};
