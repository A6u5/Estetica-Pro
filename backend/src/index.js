import express from "express";
import cors from "cors";
import { clientRouter } from "./routes/clientRoutes.js";
import { initDB } from "./initDB.js";
import { appointmentRouter } from "./routes/appointmentRoutes.js";
import { masterDataRouter } from "./routes/masterDataRoutes.js";
import { paymentRouter } from "./routes/paymentRoutes.js";
import { authRouter } from "./routes/authRoutes.js";
import reportRouter from "./routes/reportRoutes.js";
import { inventoryRouter } from "./routes/inventoryRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/clients", clientRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/masterData", masterDataRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/auth", authRouter);
app.use("/api/reports", reportRouter);
app.use("/api/inventory", inventoryRouter);

// Inicializar DB y levantar servidor
// initDB();

const PORT = 5000;

const startServer = async () => {
  try {
    await initDB(); // 👈 Espera a que todas las tablas se creen
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  } catch (err) {
    console.error("Error inicializando la base de datos:", err);
  }
};

startServer();