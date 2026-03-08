import bcrypt from "bcryptjs";
import { pool } from "../database/db.js";

export const register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username y password son obligatorios' });
  }

  try {
    // Contar cuántos usuarios hay actualmente
    const countResult = await pool.query('SELECT COUNT(*) FROM users');
    const userCount = parseInt(countResult.rows[0].count, 10);

    if (userCount >= 4) {
      return res.status(403).json({ message: 'No se pueden registrar más usuarios (máximo 4)' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
      [username, hashedPassword]
    );

    res.json({ user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }
    console.error(err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const login =async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) 
    return res.status(400).json({ message: 'Username y password son obligatorios' });

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) return res.status(400).json({ message: 'Usuario o contraseña incorrecta' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Usuario o contraseña incorrecta' });

    // Creamos un token JWT opcional
    // const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
