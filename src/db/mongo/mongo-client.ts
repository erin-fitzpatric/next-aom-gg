"use server";
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

  try {
    mongoClient = await mongoose.connect(process.env.MONGODB_URI||"");
    return mongoClient;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to connect to MongoDB error: " + err);
  }
}
