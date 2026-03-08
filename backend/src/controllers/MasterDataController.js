import { pool } from "../database/db.js";

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

// Obtener todos los metodos de pago
export const getAllPaymentMethods = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM payment_methods ORDER BY id ASC");
        res.json(result.rows);
    } catch (error) {
        console.error("Error obteniendo metodos de pago:", error);
        res.status(500).json({ error: "Error al obtener los metodos de pago" });
    }
};

// Obtener todos los estados de un pago
export const getAllPaymentStatus = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM payment_status ORDER BY id ASC");
        res.json(result.rows);
    } catch (error) {
        console.error("Error obteniendo estados de un pago:", error);
        res.status(500).json({ error: "Error al obtener los estados de un pago" });
    }
};

// Obtener todos las categorias
export const getAllCategories = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM categories ORDER BY id ASC");
        res.json(result.rows);
    } catch (error) {
        console.error("Error obteniendo categorias:", error);
        res.status(500).json({ error: "Error al obtener las categorias" });
    }
};
