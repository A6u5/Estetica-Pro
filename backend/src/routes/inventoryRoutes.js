import { Router } from "express";
import { createStock, deleteStock, getAllStock, getLowStock, updateStock } from "../controllers/Inventorycontroller.js";

export const inventoryRouter = Router();

inventoryRouter.get("/", getAllStock);
inventoryRouter.post("/", createStock);
inventoryRouter.put("/:id", updateStock);
inventoryRouter.delete("/:id", deleteStock);
inventoryRouter.get("/low", getLowStock); 