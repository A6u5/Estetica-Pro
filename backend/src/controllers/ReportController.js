import { pool } from "../database/db.js";
import ExcelJS from "exceljs";

export const getReports = async (req, res) => {
  try {
    const monthlyRevenueQuery = `
      SELECT 
        TO_CHAR(DATE_TRUNC('month', a.appointment_date), 'Mon YYYY') AS month,
        SUM(p.amount) AS revenue,
        COUNT(a.id) AS appointments
      FROM appointments a
      JOIN payments p ON p.appointment_id = a.id
      GROUP BY 1
      ORDER BY MIN(a.appointment_date);
    `;

    const popularServicesQuery = `
      SELECT 
        s.name,
        COUNT(a.id) AS count,
        SUM(p.amount) AS revenue,
        ROUND(AVG(p.amount), 2) AS avgPrice
      FROM services s
      JOIN appointments a ON a.service_id = s.id
      JOIN payments p ON p.appointment_id = a.id
      GROUP BY s.name
      ORDER BY revenue DESC
      LIMIT 5;
    `;

    const hourlyDistributionQuery = `
      SELECT 
        TO_CHAR(appointment_time, 'HH24:MI') AS hour,
        COUNT(*) AS appointments
      FROM appointments
      GROUP BY 1
      ORDER BY 1;
    `;

    const [monthlyRevenue, popularServices, hourlyDistribution] = await Promise.all([
      pool.query(monthlyRevenueQuery),
      pool.query(popularServicesQuery),
      pool.query(hourlyDistributionQuery),
    ]);

    res.json({
      monthlyRevenue: monthlyRevenue.rows,
      popularServices: popularServices.rows,
      hourlyDistribution: hourlyDistribution.rows,
    });
  } catch (error) {
    console.error("Error al obtener reportes:", error);
    res.status(500).json({ message: "Error al obtener reportes" });
  }
};

export const getActiveClients = async (req, res) => {
  try {
    const query = `
      SELECT COUNT(DISTINCT client_id) AS activeClients
      FROM appointments
      WHERE DATE_TRUNC('month', appointment_date) = DATE_TRUNC('month', CURRENT_DATE);
    `;
    const result = await pool.query(query);
    res.json({ activeClients: result.rows[0].activeclients });
  } catch (error) {
    console.error("Error al obtener clientes activos:", error);
    res.status(500).json({ message: "Error al obtener clientes activos" });
  }
};

export const exportFullReport = async (req, res) => {
  try {
    const [monthlyRevenue, popularServices, hourlyDistribution] = await Promise.all([
      pool.query(`
        SELECT 
          TO_CHAR(DATE_TRUNC('month', a.appointment_date), 'Mon YYYY') AS month,
          SUM(p.amount) AS revenue,
          COUNT(a.id) AS appointments
        FROM appointments a
        JOIN payments p ON p.appointment_id = a.id
        GROUP BY 1
        ORDER BY MIN(a.appointment_date);
      `),
      pool.query(`
        SELECT 
          s.name,
          COUNT(a.id) AS count,
          SUM(p.amount) AS revenue,
          ROUND(AVG(p.amount), 2) AS avgPrice
        FROM services s
        JOIN appointments a ON a.service_id = s.id
        JOIN payments p ON p.appointment_id = a.id
        GROUP BY s.name
        ORDER BY revenue DESC;
      `),
      pool.query(`
        SELECT 
          TO_CHAR(a.appointment_date, 'HH24:00') AS hour,
          COUNT(*) AS appointments
        FROM appointments a
        GROUP BY 1
        ORDER BY 1;
      `),
    ]);

    const workbook = new ExcelJS.Workbook();

    // --- Hoja 1: Ingresos mensuales ---
    const sheet1 = workbook.addWorksheet("Ingresos Mensuales");
    sheet1.columns = [
      { header: "Mes", key: "month", width: 15 },
      { header: "Ingresos", key: "revenue", width: 15 },
      { header: "Turnos", key: "appointments", width: 15 },
    ];
    sheet1.addRows(monthlyRevenue.rows);

    // --- Hoja 2: Servicios más populares ---
    const sheet2 = workbook.addWorksheet("Servicios Populares");
    sheet2.columns = [
      { header: "Servicio", key: "name", width: 25 },
      { header: "Cantidad", key: "count", width: 15 },
      { header: "Ingresos", key: "revenue", width: 15 },
      { header: "Promedio", key: "avgprice", width: 15 },
    ];
    sheet2.addRows(popularServices.rows);

    // --- Hoja 3: Distribución horaria ---
    const sheet3 = workbook.addWorksheet("Distribución Horaria");
    sheet3.columns = [
      { header: "Hora", key: "hour", width: 15 },
      { header: "Turnos", key: "appointments", width: 15 },
    ];
    sheet3.addRows(hourlyDistribution.rows);

    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", 'attachment; filename="reporte_completo.xlsx"');
    res.send(buffer);
  } catch (error) {
    console.error("Error al exportar el reporte:", error);
    res.status(500).json({ message: "Error al exportar el reporte" });
  }
};
