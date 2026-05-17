import cloudinary from "cloudinary";
import jwt from "jsonwebtoken";

import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { ErrorHandler } from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";

const clearAuthCookie = (res, tokenName) => {
  const isSecure = process.env.NODE_ENV === "production";
  const sameSite = isSecure ? "none" : "lax";

  res.clearCookie(tokenName, {
    httpOnly: true,
    secure: isSecure,
    sameSite,
    path: "/",
  });
};

const hasCloudinaryConfig = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );

export const registerPatient = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, nic, dob, gender, password } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password
  ) {
    return next(new ErrorHandler("Please fill full registration form.", 400));
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return next(new ErrorHandler("User already exists with this email.", 400));
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Patient",
  });

  sendToken(user, 201, res, "patientToken");
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please provide email, password and role.", 400));
  }

  const user = await User.findOne({ email: email.toLowerCase(), role }).select("+password");
  if (!user) return next(new ErrorHandler("Invalid email or password.", 401));

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password.", 401));
  }

  const tokenName =
    role === "Admin" ? "adminToken" : role === "Doctor" ? "doctorToken" : "patientToken";

  sendToken(user, 200, res, tokenName);
});

export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, nic, dob, gender, password } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password
  ) {
    return next(new ErrorHandler("Please fill full admin form.", 400));
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return next(new ErrorHandler("User already exists with this email.", 400));
  }

  const admin = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Admin",
  });

  res.status(201).json({
    success: true,
    message: "New admin added successfully.",
    admin: {
      _id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      role: admin.role,
    },
  });
});

export const bootstrapAdmin = catchAsyncErrors(async (req, res, next) => {
  const { bootstrapKey, firstName, lastName, email, phone, nic, dob, gender, password } = req.body;

  if (!process.env.BOOTSTRAP_ADMIN_KEY) {
    return next(new ErrorHandler("BOOTSTRAP_ADMIN_KEY is not configured.", 500));
  }
  if (!bootstrapKey || bootstrapKey !== process.env.BOOTSTRAP_ADMIN_KEY) {
    return next(new ErrorHandler("Invalid bootstrap key.", 401));
  }

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password
  ) {
    return next(new ErrorHandler("Please fill full admin form.", 400));
  }

  const normalizedEmail = email.toLowerCase();
  const existingAdmin = await User.findOne({ role: "Admin" });
  const adminWithEmail = await User.findOne({ email: normalizedEmail, role: "Admin" }).select(
    "+password"
  );

  if (existingAdmin && !adminWithEmail) {
    return next(
      new ErrorHandler("Admin already exists. Use the existing admin email to reset password.", 400)
    );
  }

  if (adminWithEmail) {
    adminWithEmail.firstName = firstName;
    adminWithEmail.lastName = lastName;
    adminWithEmail.phone = phone;
    adminWithEmail.nic = nic;
    adminWithEmail.dob = dob;
    adminWithEmail.gender = gender;
    adminWithEmail.password = password;
    await adminWithEmail.save();

    return res.status(200).json({
      success: true,
      message: "Bootstrap admin reset successfully.",
      admin: {
        _id: adminWithEmail._id,
        firstName: adminWithEmail.firstName,
        lastName: adminWithEmail.lastName,
        email: adminWithEmail.email,
        role: adminWithEmail.role,
      },
    });
  }

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return next(new ErrorHandler("User already exists with this email.", 400));
  }

  const admin = await User.create({
    firstName,
    lastName,
    email: normalizedEmail,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Admin",
  });

  res.status(201).json({
    success: true,
    message: "Bootstrap admin created successfully.",
    admin: {
      _id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      role: admin.role,
    },
  });
});

export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, nic, dob, gender, password, doctorDepartment } =
    req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password ||
    !doctorDepartment
  ) {
    return next(new ErrorHandler("Please fill full doctor form.", 400));
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return next(new ErrorHandler("User already exists with this email.", 400));
  }

  let docAvatar = null;
  const canUploadToCloudinary = hasCloudinaryConfig() && req.files?.docAvatar;

  if (canUploadToCloudinary) {
    const avatar = req.files.docAvatar;
    const cloudinaryResponse = await cloudinary.v2.uploader.upload(avatar.tempFilePath, {
      folder: "hospital/doctors",
    });

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      return next(new ErrorHandler("Failed to upload doctor avatar to Cloudinary.", 500));
    }

    docAvatar = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Doctor",
    doctorDepartment,
    docAvatar,
  });

  res.status(201).json({
    success: true,
    message: "New doctor added successfully.",
    doctor,
  });
});

export const getAllDoctors = catchAsyncErrors(async (req, res) => {
  const doctors = await User.find({ role: "Doctor" }).select("-password");
  res.status(200).json({ success: true, doctors });
});

export const getDoctorById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const doctor = await User.findOne({ _id: id, role: "Doctor" }).select("-password");
  if (!doctor) return next(new ErrorHandler("Doctor not found.", 404));
  res.status(200).json({ success: true, doctor });
});

export const getPatientMe = catchAsyncErrors(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export const getAdminMe = catchAsyncErrors(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export const getDoctorMe = catchAsyncErrors(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export const getMe = catchAsyncErrors(async (req, res, next) => {
  const { patientToken, adminToken, doctorToken } = req.cookies;

  let user = null;
  let token = adminToken || doctorToken || patientToken;

  if (!token) {
    return next(new ErrorHandler("User not authenticated.", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    user = await User.findById(decoded.id).select("-password");
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired token.", 401));
  }

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

const clearAllAuthCookies = (res) => {
  clearAuthCookie(res, "patientToken");
  clearAuthCookie(res, "adminToken");
  clearAuthCookie(res, "doctorToken");
};

export const logoutPatient = catchAsyncErrors(async (req, res) => {
  clearAllAuthCookies(res);
  res.status(200).json({ success: true, message: "Logged out." });
});

export const logoutAdmin = catchAsyncErrors(async (req, res) => {
  clearAllAuthCookies(res);
  res.status(200).json({ success: true, message: "Logged out." });
});

export const logoutDoctor = catchAsyncErrors(async (req, res) => {
  clearAllAuthCookies(res);
  res.status(200).json({ success: true, message: "Logged out." });
});

export const logoutAll = catchAsyncErrors(async (req, res) => {
  clearAllAuthCookies(res);
  res.status(200).json({ success: true, message: "Logged out." });
});

export const updateDoctor = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const doctor = await User.findOne({ _id: id, role: "Doctor" });
  if (!doctor) return next(new ErrorHandler("Doctor not found.", 404));

  const allowed = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "nic",
    "dob",
    "gender",
    "doctorDepartment",
  ];
  for (const key of allowed) {
    if (typeof req.body[key] !== "undefined") doctor[key] = req.body[key];
  }

  if (req.files && req.files.docAvatar && hasCloudinaryConfig()) {
    if (doctor.docAvatar?.public_id) {
      await cloudinary.v2.uploader.destroy(doctor.docAvatar.public_id);
    }
    const uploaded = await cloudinary.v2.uploader.upload(req.files.docAvatar.tempFilePath, {
      folder: "hospital/doctors",
    });
    doctor.docAvatar = { public_id: uploaded.public_id, url: uploaded.secure_url };
  }

  await doctor.save();
  res.status(200).json({ success: true, message: "Doctor updated.", doctor });
});

export const deleteDoctor = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const doctor = await User.findOne({ _id: id, role: "Doctor" });
  if (!doctor) return next(new ErrorHandler("Doctor not found.", 404));

  if (doctor.docAvatar?.public_id) {
    await cloudinary.v2.uploader.destroy(doctor.docAvatar.public_id);
  }

  await doctor.deleteOne();
  res.status(200).json({ success: true, message: "Doctor deleted." });
});
