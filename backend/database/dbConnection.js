import mongoose from "mongoose";


import { MongoMemoryServer } from "mongodb-memory-server";

let memoryServer = null;

export const connectDB = async () => {
  if (!process.env.MONGO_URI || process.env.MONGO_URI.includes("<cluster-url>")) {
    console.log("Using MongoDB In-Memory Server because Atlas URI is not configured...");
    if (!memoryServer) {
      memoryServer = await MongoMemoryServer.create();
    }
    const uri = memoryServer.getUri();
    try {
      await mongoose.connect(uri);
      console.log("Connected to MongoDB In-Memory Server successfully!");
      return;
    } catch (error) {
      console.error(`Error connecting to In-Memory MongoDB: ${error.message}`);
      process.exit(1);
    }
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB Atlas successfully!");
  } catch (error) {
    console.error(`Error connecting to MongoDB Atlas: ${error.message}`);
    process.exit(1);
  }
};

