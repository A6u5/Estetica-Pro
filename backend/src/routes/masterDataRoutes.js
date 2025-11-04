import express from "express";
import { getAllStatus, getAllServices, getAllPaymentMethods, getAllPaymentStatus, getAllCategories } from "../controllers/MasterDataController.js";

export const masterDataRouter = express.Router();

masterDataRouter.get("/status", getAllStatus);
masterDataRouter.get("/services", getAllServices);
masterDataRouter.get("/paymentMethods", getAllPaymentMethods); 
masterDataRouter.get("/paymentStatus", getAllPaymentStatus); 
masterDataRouter.get("/categories", getAllCategories); 