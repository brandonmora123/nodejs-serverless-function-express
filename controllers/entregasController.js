 
const db = require('../models/db');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

exports.upload = upload.single('evidencia');

// Registrar entrega
exports.registrarEntrega = async (req, res) => {
  const { id_paquete, id_beneficiario, observaciones } = req.body;
  const ruta_evidencia = req.file ? `/uploads/${req.file.filename}` : null;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Insertar entrega
    await connection.execute(
      `INSERT INTO entrega (fecha_entrega, id_beneficiario, id_paquete, id_usuario, metodo_registro, observaciones)
       VALUES (CURDATE(), ?, ?, ?, 'Digital', ?)`,
      [id_beneficiario, id_paquete, req.user.id, observaciones]
    );

    // Actualizar estado del paquete
    await connection.execute(
      `UPDATE paquete SET estado = 'Entregado' WHERE id_paquete = ?`,
      [id_paquete]
    );

    await connection.commit();
    res.json({ message: 'Entrega registrada con éxito' });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
};

// Listar entregas
exports.listarEntregas = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT e.id_entrega, e.fecha_entrega, e.observaciones,
             p.codigo_unico,
             b.nombre as nombre_beneficiario,
             u.nombre as nombre_usuario
      FROM entrega e
      JOIN paquete p ON e.id_paquete = p.id_paquete
      JOIN beneficiarios b ON e.id_beneficiario = b.id_beneficiario
      JOIN usuarios u ON e.id_usuario = u.id_usuario
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};