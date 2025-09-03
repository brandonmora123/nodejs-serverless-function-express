 
const db = require('../models/db');

// Registrar testimonio
exports.registrarTestimonio = async (req, res) => {
  const { id_entrega, comentario, calificacion, anonimo } = req.body;

  try {
    // Verificar que la entrega exista
    const [entrega] = await db.execute(`SELECT * FROM entrega WHERE id_entrega = ?`, [id_entrega]);
    if (entrega.length === 0) return res.status(404).json({ error: 'Entrega no encontrada' });

    await db.execute(
      `INSERT INTO retroalimentacion (id_entrega, comentario, calificacion, fecha, anonimo)
       VALUES (?, ?, ?, CURDATE(), ?)`,
      [id_entrega, comentario, calificacion, anonimo ? 1 : 0]
    );

    res.json({ message: 'Testimonio registrado con éxito' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar testimonios
exports.listarTestimonios = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT r.*, e.fecha_entrega, b.nombre as beneficiario_nombre, b.apellido as beneficiario_apellido
      FROM retroalimentacion r
      JOIN entrega e ON r.id_entrega = e.id_entrega
      JOIN beneficiarios b ON e.id_beneficiario = b.id_beneficiario
      ORDER BY r.fecha DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};