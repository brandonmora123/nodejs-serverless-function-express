 
const db = require('../models/db');
const bcrypt = require('bcrypt');

// Listar usuarios
exports.listarUsuarios = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT u.*, r.nombre_rol
      FROM usuarios u
      JOIN roles r ON u.id_rol = r.id_rol
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear usuario
exports.crearUsuario = async (req, res) => {
  const { nombre, apellido, correo, contrasena, id_rol } = req.body;
  const hashedPassword = await bcrypt.hash(contrasena, 10);

  try {
    await db.execute(
      `INSERT INTO usuarios (nombre, apellido, correo, contrasena, id_rol, fecha_registro, activo)
       VALUES (?, ?, ?, ?, ?, CURDATE(), 1)`,
      [nombre, apellido, correo, hashedPassword, id_rol]
    );
    res.json({ message: 'Usuario creado con éxito' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Este correo ya está registrado' });
    }
    res.status(500).json({ error: err.message });
  }
};