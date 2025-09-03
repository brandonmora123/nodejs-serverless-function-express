 
const db = require('../models/db');
const { generarCodigoUnico } = require('../utils/generateCodigo');

// Crear paquete
exports.crearPaquete = async (req, res) => {
  const { nombre, descripcion, donaciones } = req.body;
  const codigo_unico = generarCodigoUnico();

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Insertar paquete
    const [paqueteResult] = await connection.execute(
      `INSERT INTO paquete (nombre, descripcion, fecha_armado, id_usuario_preparador, estado, codigo_unico)
       VALUES (?, ?, CURDATE(), ?, 'Disponible', ?)`,
      [nombre, descripcion, req.user.id, codigo_unico]
    );

    const id_paquete = paqueteResult.insertId;

    // Insertar detalle y actualizar estado de donaciones
    for (const item of donaciones) {
      await connection.execute(
        `INSERT INTO detalle_paquete (id_paquete, id_donacion, cantidad_usada, fecha_asignacion)
         VALUES (?, ?, ?, CURDATE())`,
        [id_paquete, item.id_donacion, item.cantidad_usada]
      );

      await connection.execute(
        `UPDATE donaciones SET estado = 'Asignada' WHERE id_donacion = ?`,
        [item.id_donacion]
      );
    }

    await connection.commit();
    res.json({ message: 'Paquete creado con éxito', codigo: codigo_unico });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
};

// Listar paquetes
exports.listarPaquetes = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT p.*, u.nombre as preparador_nombre, u.apellido as preparador_apellido
      FROM paquete p
      JOIN usuarios u ON p.id_usuario_preparador = u.id_usuario
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Buscar por código
exports.obtenerPorCodigo = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT p.*, u.nombre as preparador_nombre, u.apellido as preparador_apellido
      FROM paquete p
      JOIN usuarios u ON p.id_usuario_preparador = u.id_usuario
      WHERE p.codigo_unico = ? AND p.estado = 'Disponible'
    `, [req.params.codigo_unico]);

    if (rows.length === 0) return res.status(404).json({ error: 'Paquete no encontrado o no disponible' });

    const paquete = rows[0];

    // Obtener contenido
    const [detalle] = await db.execute(`
      SELECT d.descripcion, dp.cantidad_usada, d.unidad
      FROM detalle_paquete dp
      JOIN donaciones d ON dp.id_donacion = d.id_donacion
      WHERE dp.id_paquete = ?
    `, [paquete.id_paquete]);

    paquete.donaciones = detalle;
    res.json(paquete);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};