const { Pool } = require("pg");

// configurar de acuerdo a cada usuario local.. 
export const pool = new Pool({
  user: "TU_USUARIO_LOCAL",      // tu usuario PostgreSQL
  host: "localhost",
  database: "lune",        // tu base de datos
  password: "TU_PASSWORD_LOCAL", // tu contraseña
  port: 5432
});