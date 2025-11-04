import { pool } from "../db.js";

export const createStock = async (req, res) => {
  try {
    const {
      name,
      category_id,
      currentStock,
      minimumStock,
      maxStock,
      unitPrice,
      supplier,
      lastRestock,
      description
    } = req.body;

    // Validaciones básicas
    if (!name || !category_id) {
      return res.status(400).json({ message: "Faltan campos obligatorios: name o category_id." });
    }

    // Inserción
    const insertResult = await pool.query(
      `INSERT INTO stock 
        (name, category_id, currentstock, minimumstock, maxstock, unitprice, supplier, lastrestock, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id;`,
      [
        name,
        category_id,
        currentStock || 0,
        minimumStock || 0,
        maxStock || 0,
        unitPrice || 0,
        supplier || null,
        lastRestock || null,
        description || null
      ]
    );

    const newId = insertResult.rows[0].id;

    // Consultar con JOIN a categorías
    const result = await pool.query(`
      SELECT 
        s.id,
        s.name,
        s.category_id,
        c.name AS category_name,
        s.currentstock,
        s.minimumstock,
        s.maxstock,
        s.unitprice,
        s.supplier,
        s.lastrestock,
        s.description
      FROM stock s
      JOIN categories c ON s.category_id = c.id
      WHERE s.id = $1;
    `, [newId]);

    res.status(201).json({
      message: "Producto creado exitosamente.",
      stock: camelCaseKeys(result.rows)[0]
    });

  } catch (error) {
    console.error("Error al crear el producto:", error);
    res.status(500).json({ message: "Error al crear el producto", error: error.message });
  }
};

// Obtener todos los productos con su categoría
export const getAllStock = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.id,
        s.name,
        s.category_id,
        c.name AS category_name,
        s.currentstock,
        s.minimumstock,
        s.maxstock,
        s.unitprice,
        s.supplier,
        s.lastrestock,
        s.description
      FROM stock s
      JOIN categories c ON s.category_id = c.id
      ORDER BY s.id ASC;
    `);

    const payload = camelCaseKeys(result.rows);
    res.status(200).json(payload);
  } catch (error) {
    console.error("Error al obtener el stock:", error);
    res.status(500).json({ message: "Error al obtener el stock", error: error.message });
  }
};

// Actualizar producto
export const updateStock = async (req, res) => {
  const { id } = req.params;
  const { name, category_id, currentStock, minimumStock, maxStock, unitPrice, supplier, lastRestock, description } = req.body;

  try {
    const updateQuery = `
      UPDATE stock
      SET 
        name = COALESCE($1, name),
        category_id = COALESCE($2, category_id),
        currentstock = COALESCE($3, currentstock),
        minimumstock = COALESCE($4, minimumstock),
        maxstock = COALESCE($5, maxstock),
        unitprice = COALESCE($6, unitprice),
        supplier = COALESCE($7, supplier),
        lastrestock = COALESCE($8, lastrestock),
        description = COALESCE($9, description)
      WHERE id = $10
      RETURNING *;
    `;

    const result = await pool.query(updateQuery, [
      name,
      category_id,
      currentStock,
      minimumStock,
      maxStock,
      unitPrice,
      supplier,
      lastRestock,
      description,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Devolver con la categoría
    const joined = await pool.query(`
      SELECT 
        s.id,
        s.name,
        s.category_id,
        c.name AS category_name,
        s.currentstock,
        s.minimumstock,
        s.maxstock,
        s.unitprice,
        s.supplier,
        s.lastrestock,
        s.description
      FROM stock s
      JOIN categories c ON s.category_id = c.id
      WHERE s.id = $1;
    `, [id]);

    const payload = camelCaseKeys(joined.rows);
    res.status(200).json(payload[0]);
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({ message: "Error al actualizar el producto", error: error.message });
  }
};

// Eliminar producto
export const deleteStock = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`DELETE FROM stock WHERE id = $1 RETURNING *;`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.status(200).json({ message: "Producto eliminado correctamente", deleted: result.rows[0] });
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res.status(500).json({ message: "Error al eliminar el producto", error: error.message });
  }
};

// Obtener productos con stock bajo
export const getLowStock = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        name,
        currentstock AS "current",
        minimumstock AS "minimum"
      FROM stock
      WHERE currentstock <= minimumstock
      ORDER BY currentstock ASC;
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener productos con bajo stock:", error);
    res.status(500).json({
      message: "Error al obtener productos con bajo stock",
      error: error.message,
    });
  }
};

const camelCaseKeys = (data) => {
    const formatted = data.map(row => ({
        id: row.id,
        name: row.name,
        category_id: row.category_id,
        category_name: row.category_name,
        currentStock: row.currentstock,
        minimumStock: row.minimumstock,
        maxStock: row.maxstock,
        unitPrice: row.unitprice,
        supplier: row.supplier,
        lastRestock: row.lastrestock,
        description: row.description
        }));
    return formatted;
};