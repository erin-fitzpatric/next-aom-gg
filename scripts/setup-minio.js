const { S3Client, CreateBucketCommand } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");

dotenv.config();

const s3Client = new S3Client({
  region: "us-east-1",
  endpoint: "http://localhost:9000",
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.MINIO_ROOT_USER,
    secretAccessKey: process.env.MINIO_ROOT_PASSWORD,
  },
});

async function createBucket() {
  const bucketName = process.env.NEXT_PUBLIC_S3_REC_BUCKET_NAME;
  try {
    await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
    console.log(`Bucket ${bucketName} created successfully.`);
  } catch (err) {
    if (err.name === "BucketAlreadyExists") {
      console.log(`Bucket ${bucketName} already exists.`);
    } else {
      console.error("Error creating bucket:", err);
    }
  }
}

createBucket();