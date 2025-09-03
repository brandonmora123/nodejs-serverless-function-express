// controllers/ubicacionController.js
const db = require('../models/db');

// Obtener todas las provincias
exports.listarProvincias = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id_provincia AS id, nombre FROM provincias ORDER BY nombre');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener cantones por provincia
exports.listarCantonesPorProvincia = async (req, res) => {
  const { id_provincia } = req.params;

  try {
    const [rows] = await db.execute(
      `SELECT id_canton AS id, nombre FROM cantones WHERE id_provincia = ? ORDER BY nombre`,
      [id_provincia]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener distritos por cantón
exports.listarDistritosPorCanton = async (req, res) => {
  const { id_canton } = req.params;

  try {
    const [rows] = await db.execute(
      `SELECT id_distrito AS id, nombre FROM distritos WHERE id_canton = ? ORDER BY nombre`,
      [id_canton]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener un distrito por ID (para perfil)
exports.obtenerDistrito = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute(`
      SELECT d.nombre AS nombre_distrito, c.nombre AS nombre_canton, p.nombre AS nombre_provincia
      FROM distritos d
      JOIN cantones c ON d.id_canton = c.id_canton
      JOIN provincias p ON c.id_provincia = p.id_provincia
      WHERE d.id_distrito = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Distrito no encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.listarTodosDistritos = async (req, res) => {
    try {
      const [rows] = await db.execute(`
        SELECT 
          d.id_distrito,
          d.nombre AS nombre_distrito,
          c.nombre AS nombre_canton,
          p.nombre AS nombre_provincia
        FROM distritos d
        JOIN cantones c ON d.id_canton = c.id_canton
        JOIN provincias p ON c.id_provincia = p.id_provincia
        ORDER BY p.nombre, c.nombre, d.nombre
      `);
  
      res.json(rows);
    } catch (err) {
      console.error('Error al obtener distritos:', err);
      res.status(500).json({ error: 'Error del servidor al obtener los distritos' });
    }
  };