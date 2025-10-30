import express from "express";
import { getAppointments, createAppointment, updateAppointment, deleteAppointment, getAppointmentsWithoutPayment } from "../controllers/AppointmentController.js";


export const appointmentRouter = express.Router();

appointmentRouter.get("/", getAppointments);
appointmentRouter.post("/", createAppointment);
appointmentRouter.put("/:id", updateAppointment);
appointmentRouter.delete("/:id", deleteAppointment);
appointmentRouter.get("/appointmentsWithoutPayment", getAppointmentsWithoutPayment)