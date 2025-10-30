import express from "express";
import { createPayment, getAllPayments, updatePayment, deletePayment } from "../controllers/PaymentController.js";

export const paymentRouter = express.Router();

paymentRouter.post("/", createPayment);
paymentRouter.get("/", getAllPayments);
paymentRouter.put("/:id", updatePayment);
paymentRouter.delete("/:id", deletePayment);
