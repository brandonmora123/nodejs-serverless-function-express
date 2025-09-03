 
const db = require('../models/db');

// Listar donaciones
exports.listarDonaciones = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT d.*, 
             don.nombre as donante_nombre, don.apellido as donante_apellido, don.empresa,
             cat.nombre_categoria,
             cam.nombre as nombre_campana,
             u.nombre as usuario_nombre, u.apellido as usuario_apellido
      FROM donaciones d
      LEFT JOIN donantes don ON d.id_donante = don.id_donante
      LEFT JOIN categorias cat ON d.id_categoria = cat.id_categoria
      LEFT JOIN campanas cam ON d.id_campana = cam.id_campana
      LEFT JOIN usuarios u ON d.id_usuario = u.id_usuario
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear donación
exports.crearDonacion = async (req, res) => {
  const { tipo, descripcion, cantidad, unidad, valor_monetario, fecha_ingreso, id_donante, id_categoria, id_campana, fecha_vencimiento } = req.body;

  try {
    const [result] = await db.execute(
      `INSERT INTO donaciones (tipo, descripcion, cantidad, unidad, valor_monetario, fecha_ingreso, id_donante, id_usuario, id_categoria, id_campana, estado, fecha_vencimiento)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Disponible', ?)`,
      [tipo, descripcion, cantidad, unidad, valor_monetario, fecha_ingreso, id_donante, req.user.id, id_categoria, id_campana, fecha_vencimiento]
    );
    res.json({ message: 'Donación registrada con éxito', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Alertas de vencimiento
exports.alertasVencimiento = async (req, res) => {
  const hoy = new Date();
  const limite = new Date(hoy.getTime() + 15 * 24 * 60 * 60 * 1000); // 15 días

  try {
    const [rows] = await db.execute(`
      SELECT d.*, don.nombre as donante_nombre, don.empresa
      FROM donaciones d
      LEFT JOIN donantes don ON d.id_donante = don.id_donante
      WHERE d.fecha_vencimiento IS NOT NULL 
        AND d.fecha_vencimiento BETWEEN ? AND ?
        AND d.estado = 'Disponible'
    `, [hoy.toISOString().split('T')[0], limite.toISOString().split('T')[0]]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// controllers/donacionesController.js
exports.listarDonacionesPorDonante = async (req, res) => {
    const { id } = req.params;
  
    try {
      const [rows] = await db.execute(`
        SELECT d.*, 
               don.nombre AS donante_nombre, don.apellido AS donante_apellido, don.empresa,
               cat.nombre_categoria,
               cam.nombre AS nombre_campana,
               u.nombre AS usuario_nombre, u.apellido AS usuario_apellido
        FROM donaciones d
        LEFT JOIN donantes don ON d.id_donante = don.id_donante
        LEFT JOIN categorias cat ON d.id_categoria = cat.id_categoria
        LEFT JOIN campanas cam ON d.id_campana = cam.id_campana
        LEFT JOIN usuarios u ON d.id_usuario = u.id_usuario
        WHERE d.id_donante = ?
      `, [id]);
  
      if (rows.length === 0) {
        return res.status(404).json({ error: 'No se encontraron donaciones para este donante' });
      }
  
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  