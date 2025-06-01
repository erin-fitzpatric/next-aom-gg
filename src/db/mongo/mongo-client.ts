"use server";

import mongoose, { Mongoose } from "mongoose";

// Construct the URI using environment variables
const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.ecbmcuc.mongodb.net/`;

if (!MONGO_URI) {
  throw new Error("MongoDB connection string is not defined in environment variables.");
}

// Use a global cache to persist connection across serverless invocations
let globalWithMongoose = global as typeof globalThis & {
  mongoose: { conn: Mongoose | null; promise: Promise<Mongoose> | null };
};

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = { conn: null, promise: null };
}

export default async function getMongoClient(): Promise<Mongoose> {
  if (globalWithMongoose.mongoose.conn) {
    return globalWithMongoose.mongoose.conn;
  }

  if (!globalWithMongoose.mongoose.promise) {
    globalWithMongoose.mongoose.promise = mongoose.connect(MONGO_URI, {
      appName: "Cluster0",
      maxPoolSize: 100,               // Production-safe connection pool size
      serverSelectionTimeoutMS: 5000, // Fail fast if server not found
      socketTimeoutMS: 120000,         // Close slow sockets
      connectTimeoutMS: 30000,        // Timeout for initial connection
      retryWrites: true,              // Ensure safe write retries
      w: "majority",                  // Confirm write concern
    });
  }

  globalWithMongoose.mongoose.conn = await globalWithMongoose.mongoose.promise;
  return globalWithMongoose.mongoose.conn;
}
