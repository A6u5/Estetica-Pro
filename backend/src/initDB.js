import { pool } from "./db.js";

// se maneja un try/catch por tabla para rastrear mejor los errores en caso de que ocurra alguno 
export const initDB = async () => {
    try{
        await pool.query(`
            CREATE TABLE IF NOT EXISTS status (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Tabla 'status' lista");
    } catch (err) {
        console.error("Error creando tabla status:", err);
    }
    try{
        await pool.query(`
            CREATE TABLE IF NOT EXISTS services (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL UNIQUE,          
                duration INT,            
                price NUMERIC(10,2),         
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Tabla 'services' lista");
    } catch (err) {
        console.error("Error creando tabla services:", err);
    }
    try{
        await pool.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) UNIQUE NOT NULL
            );
        `);
        console.log("Tabla 'categories' lista");
    } catch (err) {
        console.error("Error creando tabla categories:", err);
    }
    try{
        await pool.query(`
            CREATE TABLE IF NOT EXISTS payment_methods (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) UNIQUE NOT NULL
            );
        `);
        console.log("Tabla 'payment_methods' lista");
    } catch (err) {
        console.error("Error creando tabla payment_methods:", err);
    }
    try{
         await pool.query(`
            CREATE TABLE IF NOT EXISTS payment_status (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) UNIQUE NOT NULL
            );
        `);
        console.log("Tabla 'payment_status' lista");
    } catch (err) {
        console.error("Error creando tabla payment_status:", err);
    }
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS clients (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100),
                phone VARCHAR(20),
                birthDate DATE,
                preferences TEXT,
                fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Tabla 'clients' lista");
    } catch (err) {
        console.error("Error creando tabla clientes:", err);
    }
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS appointments (
                id SERIAL PRIMARY KEY,
                client_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
                service_id INT NOT NULL REFERENCES services(id),
                status_id INT REFERENCES status(id),
                appointment_date DATE NOT NULL,    
                appointment_time TIME NOT NULL,    
                professional TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Tabla 'appointments' lista");
    } catch (err) {
        console.error("Error creando tabla turnos:", err);
    }

    // insert de datos maestras
    try{
        await pool.query(`
            INSERT INTO services (name, duration, price)
            VALUES
                ('Limpieza facial', 60, 800),
                ('Manicure', 45, 600),
                ('Pedicure', 60, 700),
                ('Masaje relajante', 90, 1200),
                ('Depilación', 120, 900),
                ('Tratamiento facial', 75, 1000)
                ON CONFLICT (name) DO NOTHING;
        `);
        console.log("Datos iniciales insertados en 'services'");
    } catch (err) {
        console.error("Error insertando datos en tabla services:", err);
    }
    try{
        await pool.query(`
            INSERT INTO status (name)
            VALUES
                ('Confirmado'),
                ('Pendiente'),
                ('Cancelado'),
                ('En progreso')
                ON CONFLICT (name) DO NOTHING;
        `);
        console.log("Datos iniciales insertados en 'status'");
    } catch (err) {
        console.error("Error insertando datos en tabla status:", err);
    }
    try{
        await pool.query(`
            INSERT INTO categories (name)
            VALUES
                ('Peluquería'),
                ('Manicure'),
                ('Tratamiento capilar'),
                ('Depilación')
            ON CONFLICT (name) DO NOTHING;
        `);
        console.log("Datos iniciales insertados en 'categories'");
    } catch (err) {
        console.error("Error insertando datos en tabla categories:", err);
    }
    try{
        await pool.query(`
            INSERT INTO payment_methods (name)
            VALUES
                ('Efectivo'),
                ('Tarjeta de crédito'),
                ('Tarjeta de débito'),
                ('Transferencia bancaria'),
                ('Mercado Pago')
            ON CONFLICT (name) DO NOTHING;
        `);
        console.log("Datos iniciales insertados en 'payment_methods'");
    } catch (err) {
        console.error("Error insertando datos en tabla payment_methods:", err);
    }
    try{
        await pool.query(`
            INSERT INTO payment_status (name)
            VALUES
                ('Pendiente'),
                ('Pagado')
            ON CONFLICT (name) DO NOTHING;
        `);
        console.log("Datos iniciales insertados en 'payment_status'");
    } catch (err) {
        console.error("Error insertando datos en tabla payment_status:", err);
    }
};
