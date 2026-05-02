import express from "express";

import {
  addNewAdmin,
  addNewDoctor,
  bootstrapAdmin,
  deleteDoctor,
  getAdminMe,
  getAllDoctors,
  getDoctorById,
  getDoctorMe,
  getMe,
  getPatientMe,
  login,
  logoutAdmin,
  logoutAll,
  logoutDoctor,
  logoutPatient,
  registerPatient,
  updateDoctor,
} from "../controllers/userController.js";
import {
  isAdminAuthenticated,
  isDoctorAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

router.get("/me", getMe);
router.post("/patient/register", registerPatient);
router.post("/login", login);

router.post("/admin/bootstrap", bootstrapAdmin);
router.post("/admin/addnew", isAdminAuthenticated, addNewAdmin);
router.post("/doctor/addnew", isAdminAuthenticated, addNewDoctor);
router.get("/doctor/:id", isAdminAuthenticated, getDoctorById);
router.put("/doctor/:id", isAdminAuthenticated, updateDoctor);
router.delete("/doctor/:id", isAdminAuthenticated, deleteDoctor);

router.get("/doctors", getAllDoctors);

router.get("/patient/me", isPatientAuthenticated, getPatientMe);
router.get("/admin/me", isAdminAuthenticated, getAdminMe);
router.get("/doctor/me", isDoctorAuthenticated, getDoctorMe);

router.get("/patient/logout", logoutPatient);
router.get("/admin/logout", logoutAdmin);
router.get("/doctor/logout", logoutDoctor);
router.get("/logout", logoutAll);

export default router;
