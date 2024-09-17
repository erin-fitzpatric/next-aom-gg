import mongoose, { Mongoose } from "mongoose";

let mongoClient: Mongoose | null = null;
export default async function getMongoClient() {
  if (mongoClient) {
    return mongoClient;
  }
  const { MONGO_USER, MONGO_PASSWORD } = process.env;
  if (!MONGO_USER || !MONGO_PASSWORD) {
    throw new Error("Mongo credentials not found in environment variables.");
  }

  const mongoUrl = process.env.NODE_ENV === 'production'
    ? `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.ecbmcuc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    : `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@localhost:27017`;

  try {
    mongoClient = await mongoose.connect(mongoUrl);
    return mongoClient;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to connect to MongoDB error: " + err);
  }
}