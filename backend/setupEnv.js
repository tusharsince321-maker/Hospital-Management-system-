import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: "./config/config.env" });

if (!process.env.MONGO_URI && process.env.USE_IN_MEMORY_MONGO !== "true") {
  console.error("CRITICAL ERROR: Environment variables failed to load. Check ./config/config.env");
}