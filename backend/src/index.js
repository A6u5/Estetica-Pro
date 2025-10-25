import express from "express";
import cors from "cors";
import { pool } from "./db.js";
import { clientRouter } from "./routes/clientRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/clients", clientRouter);

// Crear tabla clientes si no existe
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        phone VARCHAR(20),
        birthDate DATE,
        preferences TEXT,
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Tabla 'clientes' lista");
  } catch (err) {
    console.error("❌ Error creando tabla clientes:", err);
  }
}

// Inicializar DB y levantar servidor
initDB();

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
