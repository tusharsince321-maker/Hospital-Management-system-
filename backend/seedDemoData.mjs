import "./setupEnv.js";
import mongoose from "mongoose";

import { connectDB } from "./database/dbConnection.js";
import { seedHospitalDemoData } from "./utils/seedHospitalDemoData.js";

try {
  await connectDB();
  const result = await seedHospitalDemoData();
  console.log(
    `Seeded hospital demo data: ${result.doctors} doctors, ${result.patients} patients, ${result.appointments} appointments.`
  );
} catch (err) {
  console.error("Failed to seed hospital demo data:", err?.message || err);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
