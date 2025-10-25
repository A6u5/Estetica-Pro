import express from "express";
import { pool } from "../db.js";

export const clientRouter = express.Router();

// Obtener todos los clientes
clientRouter.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM clientes ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener clientes" });
  }
});

// Crear nuevo cliente
clientRouter.post("/", async (req, res) => {
  const client = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO clientes(name, email, phone, birthDate, preferences)
       VALUES($1, $2, $3, $4, $5) RETURNING *`,
      [
        client.name,
        client.email || "",
        client.phone || "",
        client.birthDate || null,
        client.preferences || ""
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al crear cliente" });
  }
});

// Opcional: actualizar cliente
clientRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const client = req.body;

  try {
    const result = await pool.query(
      `UPDATE clientes
       SET name=$1, email=$2, phone=$3, birthDate=$4, preferences=$5
       WHERE id=$6 RETURNING *`,
      [
        client.name,
        client.email || "",
        client.phone || "",
        client.birthDate || null,
        client.preferences || "",
        id
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar cliente" });
  }
});
