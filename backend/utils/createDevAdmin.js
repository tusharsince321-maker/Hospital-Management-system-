import { User } from "../models/userSchema.js";

export const createDevAdmin = async () => {
  if (process.env.NODE_ENV === "production") return;

  const adminData = {
    firstName: process.env.DEV_ADMIN_FIRSTNAME || "Admin",
    lastName: process.env.DEV_ADMIN_LASTNAME || "User",
    email: process.env.DEV_ADMIN_EMAIL || "admin@example.com",
    phone: process.env.DEV_ADMIN_PHONE || "01234567890",
    nic: process.env.DEV_ADMIN_NIC || "1234567890123",
    dob: process.env.DEV_ADMIN_DOB || "1990-01-01",
    gender: process.env.DEV_ADMIN_GENDER || "Male",
    password: process.env.DEV_ADMIN_PASSWORD || "password123",
    role: "Admin",
  };

  const existingDefaultAdmin = await User.findOne({ email: adminData.email, role: "Admin" });
  if (existingDefaultAdmin) {
    console.log(`Default dev admin already exists: ${adminData.email}`);
    return;
  }

  await User.create(adminData);
  console.log(`Created default dev admin: ${adminData.email} / ${adminData.password}`);
};
