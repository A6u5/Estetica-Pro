import express from "express";
import {
  getReports,
  getActiveClients,
  exportFullReport,
} from "../controllers/ReportController.js";

const router = express.Router();

router.get("/", getReports);
router.get("/active-clients", getActiveClients);
router.get("/export", exportFullReport);

export default router;
