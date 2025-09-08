import { Router } from "express";
import { getTurns, createTurn, updateTurn, deleteTurn } from "../controllers/TurnController";

export const turnRouter = Router();

turnRouter.get("/", getTurns);
turnRouter.post("/", createTurn);
turnRouter.put("/", updateTurn);
turnRouter.delete("/:id", deleteTurn);