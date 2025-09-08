const express = require("express");
const { pool } = require("./db");
import cors from "cors";
import { clientRouter } from "./routes/clientRoutes";
import { turnRouter } from "./routes/turnRoutes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/clients", clientRouter);
app.use("/api/appointments", turnRouter);

// Create tables if they don't exist
async function init() {
  await pool.query(`CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    email VARCHAR(100)
  )`);

  await pool.query(`CREATE TABLE IF NOT EXISTS turns (
    id SERIAL PRIMARY KEY,
    clientId INTEGER REFERENCES clients(id),
    date DATE,
    time TIME
  )`);
}

init();

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));