import { pool } from "../database/db.js";

// Obtener todos los clientes
export const getAllClients = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM clients ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener clientes" });
  }
};

// Crear nuevo cliente
export const createClient = async (req, res) => {
  const client = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO clients(name, email, phone, birthDate, preferences)
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
};

// Actualizar cliente
export const updateClient = async (req, res) => {
  const { id } = req.params;
  const client = req.body;
  try {
    const result = await pool.query(
      `UPDATE clients
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
};
