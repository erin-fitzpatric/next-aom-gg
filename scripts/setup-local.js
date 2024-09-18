const { S3Client, CreateBucketCommand, HeadBucketCommand } = require("@aws-sdk/client-s3");
const { MongoClient } = require("mongodb");
const Redis = require("ioredis");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// Destructure environment variables
const {
  MONGO_USER,
  MONGO_PASSWORD,
  REDIS_PORT,
  REDIS_HOST,
  REDIS_PASSWORD,
  MINIO_ROOT_USER,
  MINIO_ROOT_PASSWORD,
  NEXT_PUBLIC_S3_REC_BUCKET_NAME
} = process.env;

// Verify that required environment variables are set
const requiredEnvVars = [
  'MONGO_USER', 'MONGO_PASSWORD', 'REDIS_PORT', 'REDIS_HOST', 'REDIS_PASSWORD',
  'MINIO_ROOT_USER', 'MINIO_ROOT_PASSWORD', 'NEXT_PUBLIC_S3_REC_BUCKET_NAME'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

const s3Client = new S3Client({
  region: "us-east-1",
  endpoint: "http://localhost:9000",
  forcePathStyle: true,
  credentials: {
    accessKeyId: MINIO_ROOT_USER,
    secretAccessKey: MINIO_ROOT_PASSWORD,
  },
});

async function waitForService(checkFn, serviceName, maxAttempts = 30, interval = 1000) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      await checkFn();
      console.log(`${serviceName} is ready.`);
      return;
    } catch (error) {
      console.log(`Waiting for ${serviceName}... (Attempt ${attempt + 1}/${maxAttempts})`);
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
  throw new Error(`${serviceName} did not become ready in time.`);
}

async function checkMongo() {
  const client = new MongoClient(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@localhost:27017`);
  await client.connect();
  await client.db("admin").command({ ping: 1 });
  await client.close();
}

async function checkRedis() {
  const redis = new Redis({
    port: REDIS_PORT,
    host: REDIS_HOST,
    password: REDIS_PASSWORD,
  });
  await redis.ping();
  await redis.quit();
}

async function checkMinIO() {
  await s3Client.send(new HeadBucketCommand({ Bucket: "test-bucket" }));
}

async function createBucket() {
  const bucketName = NEXT_PUBLIC_S3_REC_BUCKET_NAME;
  try {
    await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
    console.log(`Bucket ${bucketName} created successfully.`);
  } catch (err) {
    if (err.name === "BucketAlreadyExists") {
      console.log(`Bucket ${bucketName} already exists.`);
    } else {
      console.error("Error creating bucket:", err);
      throw err;
    }
  }
}

async function main() {
  try {
    await waitForService(checkMongo, "MongoDB");
    await waitForService(checkRedis, "Redis");
    await waitForService(checkMinIO, "MinIO");
    await createBucket();
    console.log("Local environment is ready!");
  } catch (error) {
    console.error("Setup failed:", error);
    process.exit(1);
  }
}

main();