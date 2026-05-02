import express from "express";

import {
  deleteAppointment,
  getAllAppointments,
  getMyAppointmentsDoctor,
  getMyAppointmentsPatient,
  postAppointment,
  updateAppointmentStatus,
} from "../controllers/appointmentController.js";
import {
  isAdminAuthenticated,
  isDoctorAuthenticated,
  isAdminOrDoctorAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

router.post("/post", isPatientAuthenticated, postAppointment);
router.get("/getall", isAdminAuthenticated, getAllAppointments);
router.put("/update/:id", isAdminOrDoctorAuthenticated, updateAppointmentStatus);
router.delete("/delete/:id", isAdminAuthenticated, deleteAppointment);

router.get("/patient/my", isPatientAuthenticated, getMyAppointmentsPatient);
router.get("/doctor/my", isDoctorAuthenticated, getMyAppointmentsDoctor);

export default router;

