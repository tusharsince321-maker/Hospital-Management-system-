import { User } from "../models/userSchema.js";

const getAdminData = (prefix) => ({
  firstName: process.env[`${prefix}_ADMIN_FIRSTNAME`] || "Admin",
  lastName: process.env[`${prefix}_ADMIN_LASTNAME`] || "User",
  email: (process.env[`${prefix}_ADMIN_EMAIL`] || "admin@example.com").toLowerCase(),
  phone: process.env[`${prefix}_ADMIN_PHONE`] || "01234567890",
  nic: process.env[`${prefix}_ADMIN_NIC`] || "1234567890123",
  dob: process.env[`${prefix}_ADMIN_DOB`] || "1990-01-01",
  gender: process.env[`${prefix}_ADMIN_GENDER`] || "Male",
  password: process.env[`${prefix}_ADMIN_PASSWORD`] || "password123",
  role: "Admin",
});

const upsertAdmin = async (adminData, { resetPassword = false, label = "admin" } = {}) => {
  const existingAdmin = await User.findOne({ email: adminData.email, role: "Admin" }).select(
    "+password"
  );

  if (!existingAdmin) {
    await User.create(adminData);
    console.log(`Created ${label}: ${adminData.email}`);
    return;
  }

  if (!resetPassword) {
    console.log(`${label} already exists: ${adminData.email}`);
    return;
  }

  existingAdmin.firstName = adminData.firstName;
  existingAdmin.lastName = adminData.lastName;
  existingAdmin.phone = adminData.phone;
  existingAdmin.nic = adminData.nic;
  existingAdmin.dob = adminData.dob;
  existingAdmin.gender = adminData.gender;
  existingAdmin.password = adminData.password;
  await existingAdmin.save();

  console.log(`Reset ${label}: ${adminData.email}`);
};

export const createDevAdmin = async () => {
  if (process.env.NODE_ENV === "production") return;

  await upsertAdmin(getAdminData("DEV"), {
    label: "default dev admin",
  });
};

export const syncStartupAdmin = async () => {
  if (process.env.SYNC_ADMIN_ON_STARTUP !== "true") return;

  const adminData = {
    firstName: process.env.ADMIN_FIRSTNAME || "Admin",
    lastName: process.env.ADMIN_LASTNAME || "User",
    email: (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase(),
    phone: process.env.ADMIN_PHONE || "01234567890",
    nic: process.env.ADMIN_NIC || "1234567890123",
    dob: process.env.ADMIN_DOB || "1990-01-01",
    gender: process.env.ADMIN_GENDER || "Male",
    password: process.env.ADMIN_PASSWORD || "password123",
    role: "Admin",
  };

  await upsertAdmin(adminData, {
    label: "startup admin",
    resetPassword: process.env.SYNC_ADMIN_PASSWORD === "true",
  });
};
