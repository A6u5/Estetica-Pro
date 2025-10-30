import { pool } from "../db.js";

// Obtener todos los turnos con datos relacionados
export const getAppointments = async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT 
            a.id,
            a.appointment_date,
            a.appointment_time,
            a.professional,
            a.created_at,
            
            -- cliente completo
            json_build_object(
            'id', c.id,
            'name', c.name,
            'email', c.email,
            'phone', c.phone,
            'birthDate', c.birthDate,
            'preferences', c.preferences,
            'fecha_registro', c.fecha_registro
            ) AS client,
            
            -- servicio completo
            json_build_object(
            'id', s.id,
            'name', s.name,
            'duration', s.duration
            ) AS service,
            
            -- estado del turno
            json_build_object(
            'id', st.id,
            'name', st.name
            ) AS status
        FROM appointments a
        JOIN clients c ON a.client_id = c.id
        JOIN services s ON a.service_id = s.id
        LEFT JOIN status st ON a.status_id = st.id
        ORDER BY a.appointment_date, a.appointment_time ASC;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error obteniendo turnos:", err);
    res.status(500).json({ message: "Error al obtener turnos" });
  }
};

// Crear nuevo turno
export const createAppointment = async (req, res) => {
  const {
    client_id,
    service_id,
    status_id,
    appointment_date,
    appointment_time,
    professional
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO appointments 
        (client_id, service_id, status_id, appointment_date, appointment_time, professional)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `,
      [client_id, service_id, status_id, appointment_date, appointment_time, professional]
    );
    
    const fullResult = await pool.query(
        `SELECT 
            a.id,
            a.appointment_date,
            a.appointment_time,
            a.professional,
            a.created_at,
            json_build_object(
                'id', c.id,
                'name', c.name,
                'email', c.email,
                'phone', c.phone,
                'birthDate', c.birthDate,
                'preferences', c.preferences,
                'fecha_registro', c.fecha_registro
            ) AS client,
            json_build_object(
                'id', s.id,
                'name', s.name,
                'duration', s.duration
            ) AS service,
            json_build_object(
                'id', st.id,
                'name', st.name
            ) AS status
        FROM appointments a
        JOIN clients c ON a.client_id = c.id
        JOIN services s ON a.service_id = s.id
        LEFT JOIN status st ON a.status_id = st.id
        WHERE a.id = $1;`,
        [result.rows[0].id]
    );

    res.status(201).json(fullResult.rows[0]);
  } catch (err) {
    console.error("Error creando turno:", err);
    res.status(500).json({ message: "Error al crear turno" });
  }
};

// Actualizar turno
export const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const {
    client_id,
    service_id,
    status_id,
    appointment_date,
    appointment_time,
    professional
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE appointments
        SET 
            client_id = $1,
            service_id = $2,
            status_id = $3,
            appointment_date = $4,
            appointment_time = $5,
            professional = $6
        WHERE id = $7
        RETURNING *;
      `,
      [client_id, service_id, status_id, appointment_date, appointment_time, professional, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Turno no encontrado" });

    const fullResult = await pool.query(
        `SELECT 
            a.id,
            a.appointment_date,
            a.appointment_time,
            a.professional,
            a.created_at,
            json_build_object(
                'id', c.id,
                'name', c.name,
                'email', c.email,
                'phone', c.phone,
                'birthDate', c.birthDate,
                'preferences', c.preferences,
                'fecha_registro', c.fecha_registro
            ) AS client,
            json_build_object(
                'id', s.id,
                'name', s.name,
                'duration', s.duration
            ) AS service,
            json_build_object(
                'id', st.id,
                'name', st.name
            ) AS status
        FROM appointments a
        JOIN clients c ON a.client_id = c.id
        JOIN services s ON a.service_id = s.id
        LEFT JOIN status st ON a.status_id = st.id
        WHERE a.id = $1;`,
        [result.rows[0].id]
    );

    res.status(201).json(fullResult.rows[0]);
  } catch (err) {
    console.error("Error actualizando turno:", err);
    res.status(500).json({ message: "Error al actualizar turno" });
  }
};

// Eliminar turno
export const deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM appointments WHERE id = $1 RETURNING *;",
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Turno no encontrado" });

    res.json({ message: "Turno eliminado correctamente" });
  } catch (err) {
    console.error("Error eliminando turno:", err);
    res.status(500).json({ message: "Error al eliminar turno" });
  }
};


export const getAppointmentsWithoutPayment = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.id,
        a.appointment_date,
        a.appointment_time,
        a.professional,
        a.created_at,
        
        -- cliente completo
        json_build_object(
          'id', c.id,
          'name', c.name,
          'email', c.email,
          'phone', c.phone,
          'birthDate', c.birthDate,
          'preferences', c.preferences,
          'fecha_registro', c.fecha_registro
        ) AS client,
        
        -- servicio completo
        json_build_object(
          'id', s.id,
          'name', s.name,
          'duration', s.duration
        ) AS service,
        
        -- estado del turno
        json_build_object(
          'id', st.id,
          'name', st.name
        ) AS status

      FROM appointments a
      JOIN clients c ON a.client_id = c.id
      JOIN services s ON a.service_id = s.id
      LEFT JOIN status st ON a.status_id = st.id
      LEFT JOIN payments p ON a.id = p.appointment_id
      WHERE p.appointment_id IS NULL
      ORDER BY a.appointment_date, a.appointment_time ASC;
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Error obteniendo turnos sin pago:", err);
    res.status(500).json({ message: "Error al obtener turnos sin pago" });
  }
};
