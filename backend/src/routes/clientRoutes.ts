import { Router } from "express";
import { getClients, createClient, updateClient, deleteClient } from "../controllers/ClientController";

export const clientRouter = Router();

clientRouter.get("/", getClients);
clientRouter.post("/", createClient);
clientRouter.put("/", updateClient);
clientRouter.delete("/:id", deleteClient);