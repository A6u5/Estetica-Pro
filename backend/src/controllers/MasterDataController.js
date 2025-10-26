import { pool } from "../db.js";

// Obtener todos los status
export const getAllStatus = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM status ORDER BY id ASC");
        res.json(result.rows);
    } catch (error) {
        console.error("Error obteniendo status:", error);
        res.status(500).json({ error: "Error al obtener los estados" });
    }
};

// Obtener todos los servicios
export const getAllServices = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM services ORDER BY id ASC");
        res.json(result.rows);
    } catch (error) {
        console.error("Error obteniendo servicios:", error);
        res.status(500).json({ error: "Error al obtener los servicios" });
    }
};