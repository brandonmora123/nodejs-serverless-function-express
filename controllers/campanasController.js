 
const db = require('../models/db');

// Listar campañas
exports.listarCampanas = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT c.*, 
             (SELECT COUNT(*) FROM donaciones d WHERE d.id_campana = c.id_campana) as total_donaciones,
             (SELECT COUNT(*) FROM entrega e JOIN paquete p ON e.id_paquete = p.id_paquete WHERE p.id_campana = c.id_campana) as beneficiarios_atendidos
      FROM campanas c
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear campaña
exports.crearCampana = async (req, res) => {
  const { nombre, descripcion, fecha_inicio, fecha_fin, estado, objetivo_donaciones, objetivo_beneficiarios } = req.body;

  try {
    const [result] = await db.execute(
      `INSERT INTO campanas (nombre, descripcion, fecha_inicio, fecha_fin, estado, objetivo_donaciones, objetivo_beneficiarios)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion, fecha_inicio, fecha_fin, estado, objetivo_donaciones, objetivo_beneficiarios]
    );
    res.json({ message: 'Campaña creada con éxito', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Asignar donación a campaña
exports.asignarDonacion = async (req, res) => {
  const { id_donacion, id_campana } = req.body;

  try {
    await db.execute(
      `UPDATE donaciones SET id_campana = ? WHERE id_donacion = ?`,
      [id_campana, id_donacion]
    );
    res.json({ message: 'Donación asignada a campaña con éxito' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};