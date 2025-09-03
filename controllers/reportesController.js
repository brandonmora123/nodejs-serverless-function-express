 
const db = require('../models/db');

// Dashboard
exports.dashboard = async (req, res) => {
  try {
    const [[{ total }]] = await db.execute('SELECT COUNT(*) as total FROM donaciones WHERE estado = "Disponible"');
    const [[{ entregas }]] = await db.execute('SELECT COUNT(*) as entregas FROM entrega');
    const [[{ campanas }]] = await db.execute('SELECT COUNT(*) as campanas FROM campanas WHERE estado = "En curso"');
    res.json({ inventario: total, entregas, campanas });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reporte por campaña
exports.reportePorCampana = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT c.nombre, COUNT(d.id_donacion) as donaciones, SUM(d.cantidad) as total_articulos
      FROM campanas c
      LEFT JOIN donaciones d ON c.id_campana = d.id_campana
      GROUP BY c.id_campana
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};