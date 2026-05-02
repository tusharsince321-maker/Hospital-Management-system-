import jwt from "jsonwebtoken";

import { ErrorHandler } from "./errorMiddleware.js";
import { User } from "../models/userSchema.js";

const getTokenFromCookies = (req, tokenName) => {
  const token = req.cookies?.[tokenName];
  return token || null;
};

const verifyTokenAndAttachUser = async (req, tokenName) => {
  const token = getTokenFromCookies(req, tokenName);
  if (!token) return null;
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const user = await User.findById(decoded.id).select("-password");
  return user;
};

export const isPatientAuthenticated = async (req, res, next) => {
  try {
    const user = await verifyTokenAndAttachUser(req, "patientToken");
    if (!user) return next(new ErrorHandler("Patient not authenticated.", 401));
    if (user.role !== "Patient")
      return next(new ErrorHandler("Access denied.", 403));
    req.user = user;
    next();
  } catch {
    next(new ErrorHandler("Patient not authenticated.", 401));
  }
};

export const isAdminAuthenticated = async (req, res, next) => {
  try {
    const user = await verifyTokenAndAttachUser(req, "adminToken");
    if (!user) return next(new ErrorHandler("Admin not authenticated.", 401));
    if (user.role !== "Admin") return next(new ErrorHandler("Access denied.", 403));
    req.user = user;
    next();
  } catch {
    next(new ErrorHandler("Admin not authenticated.", 401));
  }
};

export const isDoctorAuthenticated = async (req, res, next) => {
  try {
    const user = await verifyTokenAndAttachUser(req, "doctorToken");
    if (!user) return next(new ErrorHandler("Doctor not authenticated.", 401));
    if (user.role !== "Doctor")
      return next(new ErrorHandler("Access denied.", 403));
    req.user = user;
    next();
  } catch {
    next(new ErrorHandler("Doctor not authenticated.", 401));
  }
};

export const isAdminOrDoctorAuthenticated = async (req, res, next) => {
  try {
    const user =
      (await verifyTokenAndAttachUser(req, "doctorToken")) ||
      (await verifyTokenAndAttachUser(req, "adminToken"));
    if (!user) return next(new ErrorHandler("Not authenticated.", 401));
    if (user.role !== "Doctor" && user.role !== "Admin")
      return next(new ErrorHandler("Access denied.", 403));
    req.user = user;
    next();
  } catch {
    next(new ErrorHandler("Not authenticated.", 401));
  }
};

export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return next(new ErrorHandler("Not authenticated.", 401));
    if (!roles.includes(req.user.role)) {
      return next(new ErrorHandler("Access denied.", 403));
    }
    next();
  };
};

