// Import setupEnv FIRST to ensure process.env is populated for other imports
// RESTART TRIGGER: Updated CORS for port 5173
import "./setupEnv.js";
import cloudinary from "cloudinary";
import app from "./app.js";
import { connectDB } from "./database/dbConnection.js";
import { createDevAdmin, syncStartupAdmin } from "./utils/createDevAdmin.js";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

try {
  await connectDB();
  if (process.env.NODE_ENV === "development") await createDevAdmin();
  await syncStartupAdmin();
} catch (err) {
  console.error("Failed to initialize server components:", err?.message || err);
  process.exit(1);
}

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Stop the existing server or choose a different PORT.`);
    process.exit(1);
  }
  throw err;
});
