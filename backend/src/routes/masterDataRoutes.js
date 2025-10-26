import express from "express";
import { getAllStatus, getAllServices } from "../controllers/MasterDataController.js";

export const masterDataRouter = express.Router();

masterDataRouter.get("/status", getAllStatus);
masterDataRouter.get("/services", getAllServices);