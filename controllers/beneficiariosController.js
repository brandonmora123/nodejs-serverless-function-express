 
const db = require('../models/db');

// Listar beneficiarios
exports.listarBeneficiarios = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT b.*, d.nombre as distrito, c.nombre as canton, p.nombre as provincia
      FROM beneficiarios b
      LEFT JOIN distritos d ON b.id_distrito = d.id_distrito
      LEFT JOIN cantones c ON d.id_canton = c.id_canton
      LEFT JOIN provincias p ON c.id_provincia = p.id_provincia
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear beneficiario
exports.crearBeneficiario = async (req, res) => {
  const { nombre, apellido, telefono, correo, id_distrito, direccion_exacta, grupo_familiar, observaciones } = req.body;

  try {
    const [result] = await db.execute(
      `INSERT INTO beneficiarios (nombre, apellido, telefono, correo, id_distrito, direccion_exacta, grupo_familiar, observaciones)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, telefono, correo, id_distrito, direccion_exacta, grupo_familiar, observaciones]
    );
    res.json({ message: 'Beneficiario creado con éxito', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener por ID
exports.obtenerPorId = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT b.*, d.nombre as distrito, c.nombre as canton, p.nombre as provincia
      FROM beneficiarios b
      LEFT JOIN distritos d ON b.id_distrito = d.id_distrito
      LEFT JOIN cantones c ON d.id_canton = c.id_canton
      LEFT JOIN provincias p ON c.id_provincia = p.id_provincia
      WHERE b.id_beneficiario = ?
    `, [req.params.id]);

    if (rows.length === 0) return res.status(404).json({ error: 'Beneficiario no encontrado' });

    const beneficiario = rows[0];

    // Historial de entregas
    const [entregas] = await db.execute(`
      SELECT e.fecha_entrega, p.nombre as paquete, p.codigo_unico, u.nombre as entregado_por
      FROM entrega e
      JOIN paquete p ON e.id_paquete = p.id_paquete
      JOIN usuarios u ON e.id_usuario = u.id_usuario
      WHERE e.id_beneficiario = ?
      ORDER BY e.fecha_entrega DESC
    `, [req.params.id]);

    beneficiario.entregas = entregas;
    res.json(beneficiario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};