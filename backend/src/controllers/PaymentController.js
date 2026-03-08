import { pool } from "../database/db.js";

export const createPayment = async (req, res) => {
  try {
    const {
      appointment_id,
      payment_method_id,
      payment_status_id,
      amount,
      payment_date
    } = req.body;

    // Validaciones básicas
    if (!appointment_id || !payment_method_id || !payment_status_id || !payment_date) {
      return res.status(400).json({ message: "Faltan campos obligatorios." });
    }

    // Inserción
    const insertResult = await pool.query(
      `INSERT INTO payments 
        (appointment_id, payment_method_id, payment_status_id, amount, payment_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [appointment_id, payment_method_id, payment_status_id, amount || 0, payment_date]
    );

    const result = await pool.query(`
      SELECT 
        p.id,
        p.amount,
        p.payment_date,
        p.created_at,
        
        -- info del método y estado
        pm.name AS payment_method,
        ps.name AS payment_status,
        
        -- info del turno
        a.id AS appointment_id,
        a.appointment_date AS appointment_date,
        a.appointment_time AS appointment_time,

        -- info del cliente
        c.id AS client_id,
        c.name AS client_name,
        c.phone AS client_phone,

        -- info del servicio
        s.id AS service_id,
        s.name AS service_name,
        s.price AS service_price
        
      FROM payments p
      JOIN appointments a ON p.appointment_id = a.id
      JOIN clients c ON a.client_id = c.id
      JOIN services s ON a.service_id = s.id
      JOIN payment_methods pm ON p.payment_method_id = pm.id
      JOIN payment_status ps ON p.payment_status_id = ps.id
      WHERE p.id = $1
    `, [insertResult.rows[0].id]);

    return res.status(201).json({
      message: "Pago creado exitosamente.",
      payment: result.rows[0]
    });
  } catch (error) {
    console.error("Error al crear el pago:", error);
    res.status(500).json({ message: "Error al crear el pago", error: error.message });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.amount,
        p.payment_date,
        p.created_at,
        
        -- info del método y estado
        pm.name AS payment_method,
        pm.id AS payment_method_id,
        ps.name AS payment_status,
        ps.id AS payment_status_id,
        
        -- info del turno
        a.id AS appointment_id,
        a.appointment_date AS appointment_date,
        a.appointment_time AS appointment_time,

        -- info del cliente
        c.id AS client_id,
        c.name AS client_name,
        c.phone AS client_phone,

        -- info del servicio
        s.id AS service_id,
        s.name AS service_name,
        s.price AS service_price
        
      FROM payments p
      JOIN appointments a ON p.appointment_id = a.id
      JOIN clients c ON a.client_id = c.id
      JOIN services s ON a.service_id = s.id
      JOIN payment_methods pm ON p.payment_method_id = pm.id
      JOIN payment_status ps ON p.payment_status_id = ps.id
      ORDER BY p.created_at DESC
    `);

    return res.status(200).json(result.rows);

  } catch (error) {
    console.error("Error al obtener los pagos:", error);
    res.status(500).json({ message: "Error al obtener los pagos", error: error.message });
  }
};

export const updatePayment = async (req, res) => {
  const { id } = req.params;
  const { payment_method_id, payment_status_id, amount, payment_date } = req.body;

  try {
    // Actualizar el pago
    const updateQuery = `
      UPDATE payments
      SET 
        payment_method_id = COALESCE($1, payment_method_id),
        payment_status_id = COALESCE($2, payment_status_id),
        amount = COALESCE($3, amount),
        payment_date = COALESCE($4, payment_date)
      WHERE id = $5
      RETURNING *;
    `;

    const result = await pool.query(updateQuery, [
      payment_method_id,
      payment_status_id,
      amount,
      payment_date,
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Pago no encontrado" });
    }

    // Consultar el pago actualizado con joins
    const joined = await pool.query(`
      SELECT 
        p.id,
        p.amount,
        p.payment_date,
        p.created_at,
        pm.name AS payment_method,
        ps.name AS payment_status,
        a.id AS appointment_id,
        a.appointment_date AS appointment_date,
        a.appointment_date AS appointment_date,
        c.id AS client_id,
        c.name AS client_name,
        c.phone AS client_phone,
        s.id AS service_id,
        s.name AS service_name,
        s.price AS service_price
      FROM payments p
      JOIN appointments a ON p.appointment_id = a.id
      JOIN clients c ON a.client_id = c.id
      JOIN services s ON a.service_id = s.id
      JOIN payment_methods pm ON p.payment_method_id = pm.id
      JOIN payment_status ps ON p.payment_status_id = ps.id
      WHERE p.id = $1;
    `, [id]);

    res.status(200).json(joined.rows[0]);
  } catch (error) {
    console.error("Error al actualizar el pago:", error);
    res.status(500).json({ message: "Error al actualizar el pago", error: error.message });
  }
};

export const deletePayment = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`DELETE FROM payments WHERE id = $1 RETURNING *;`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Pago no encontrado" });
    }

    res.status(200).json({ message: "Pago eliminado correctamente", deleted: result.rows[0] });
  } catch (error) {
    console.error("Error al eliminar el pago:", error);
    res.status(500).json({ message: "Error al eliminar el pago", error: error.message });
  }
};
