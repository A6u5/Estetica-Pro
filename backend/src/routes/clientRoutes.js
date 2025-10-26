import express from "express";
import { getAllClients, createClient, updateClient } from "../controllers/ClientController.js";


export const clientRouter = express.Router();

clientRouter.get("/", getAllClients);
clientRouter.post("/", createClient);
clientRouter.put("/:id", updateClient);