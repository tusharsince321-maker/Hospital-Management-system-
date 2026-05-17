import express from "express";

import { getHospitalAnalytics, getRecommendation } from "../controllers/analyticsController.js";
import { isAdminOrDoctorAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/hospital", isAdminOrDoctorAuthenticated, getHospitalAnalytics);
router.post("/recommend", isAdminOrDoctorAuthenticated, getRecommendation);

export default router;
