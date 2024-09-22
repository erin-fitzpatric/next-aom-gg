"use server";

import mongoose, { ConnectOptions, Mongoose } from "mongoose";

let mongoClient: Mongoose | null = null;
export default async function getMongoClient() {
  if (mongoClient) {
    return mongoClient;
  }
  const { MONGO_USER, MONGO_PASSWORD, MONGO_HOST, MONGO_APPNAME } = process.env;
  if (!MONGO_USER || !MONGO_PASSWORD || !MONGO_HOST) {
    throw new Error("Mongo credentials not found in environment variables.");
  }

  // These options can be moved to configuration if they are different across environments
  const connectOptions: ConnectOptions = {
    retryWrites: true,
    writeConcern: {
      w: "majority",
    },
  };

  if (MONGO_APPNAME) {
    connectOptions.appName = MONGO_APPNAME;
  }

  try {

    mongoClient = await mongoose.connect(
      `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}`,
      connectOptions
    );
    return mongoClient;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to connect to MongoDB error: " + err);
  }
}
