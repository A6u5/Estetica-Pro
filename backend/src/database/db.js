import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

console.log("USER:", process.env.PGUSER);
console.log("PASSWORD:", process.env.PGPASSWORD);

export const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT)
});

// prueba opcional de conexión
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ Error conectando a la base de datos:", err);
  } else {
    console.log("✅ Conectado a PostgreSQL:", res.rows[0]);
  }
});

