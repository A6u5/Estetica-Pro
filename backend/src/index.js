import express from "express";
import cors from "cors";
import { clientRouter } from "./routes/clientRoutes.js";
import { initDB } from "./initDB.js";
import { appointmentRouter } from "./routes/appointmentRoutes.js";
import { masterDataRouter } from "./routes/masterDataRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/clients", clientRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/masterData", masterDataRouter);

// Inicializar DB y levantar servidor
initDB();

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
