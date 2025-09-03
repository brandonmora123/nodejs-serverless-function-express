 
const db = require('../models/db');

// Listar donantes
exports.listarDonantes = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT don.*, td.descripcion as tipo_donante
      FROM donantes don
      JOIN tipo_donante td ON don.id_tipo_donante = td.id_tipo_donante
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear donante
exports.crearDonante = async (req, res) => {
  const { nombre, apellido, empresa, telefono, correo, id_tipo_donante } = req.body;

  try {
    const [result] = await db.execute(
      `INSERT INTO donantes (nombre, apellido, empresa, telefono, correo, id_tipo_donante)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, empresa, telefono, correo, id_tipo_donante]
    );
    res.json({ message: 'Donante registrado con éxito', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Historial de donaciones de un donante
exports.historialDonaciones = async (req, res) => {
  try {
    const [donante] = await db.execute(`SELECT * FROM donantes WHERE id_donante = ?`, [req.params.id]);
    if (donante.length === 0) return res.status(404).json({ error: 'Donante no encontrado' });

    const [donaciones] = await db.execute(`
      SELECT d.*, c.nombre_categoria, u.nombre as registrado_por
      FROM donaciones d
      JOIN categorias c ON d.id_categoria = c.id_categoria
      JOIN usuarios u ON d.id_usuario = u.id_usuario
      WHERE d.id_donante = ?
      ORDER BY d.fecha_ingreso DESC
    `, [req.params.id]);

    res.json({ donante: donante[0], donaciones });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener un donante por ID
exports.obtenerDonante = async (req, res) => {
    const { id } = req.params;
  
    try {
      const [rows] = await db.execute(`
        SELECT don.*, td.descripcion AS tipo_donante
        FROM donantes don
        JOIN tipo_donante td ON don.id_tipo_donante = td.id_tipo_donante
        WHERE don.id_donante = ?
      `, [id]);
  
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Donante no encontrado' });
      }
  
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };