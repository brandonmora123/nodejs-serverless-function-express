// controllers/tareaController.js
const db = require('../models/db');

// Listar tareas (filtrar por usuario logueado)
exports.listarTareas = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        t.*,
        CONCAT(u.nombre, ' ', u.apellido) AS asignado_a,
        c.nombre AS nombre_campana,
        c.estado AS estado_campana
      FROM tareas t
      JOIN usuarios u ON t.id_usuario_asignado = u.id_usuario
      LEFT JOIN campanas c ON t.id_campana = c.id_campana
      ORDER BY t.fecha_limite ASC, t.prioridad DESC
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear una nueva tarea
exports.crearTarea = async (req, res) => {
  const { titulo, descripcion, id_campana, id_usuario_asignado, fecha_asignacion, fecha_limite, prioridad } = req.body;

  // Validación básica
  if (!titulo || !id_usuario_asignado || !fecha_asignacion || !prioridad) {
    return res.status(400).json({ error: 'Campos obligatorios faltantes' });
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO tareas (titulo, descripcion, id_campana, id_usuario_asignado, fecha_asignacion, fecha_limite, estado, prioridad)
       VALUES (?, ?, ?, ?, ?, ?, 'Pendiente', ?)`,
      [titulo, descripcion, id_campana, id_usuario_asignado, fecha_asignacion, fecha_limite, prioridad]
    );

    res.status(201).json({
      id_tarea: result.insertId,
      message: 'Tarea asignada con éxito'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar estado o fecha límite
exports.actualizarTarea = async (req, res) => {
  const { id_tarea } = req.params;
  const { estado, fecha_limite, descripcion } = req.body;

  try {
    const fields = [];
    const values = [];

    if (estado) { fields.push('estado = ?'); values.push(estado); }
    if (fecha_limite) { fields.push('fecha_limite = ?'); values.push(fecha_limite); }
    if (descripcion !== undefined) { fields.push('descripcion = ?'); values.push(descripcion); }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    values.push(id_tarea);
    const query = `UPDATE tareas SET ${fields.join(', ')} WHERE id_tarea = ?`;

    await db.execute(query, values);
    res.json({ message: 'Tarea actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar tarea
exports.eliminarTarea = async (req, res) => {
  const { id_tarea } = req.params;

  try {
    await db.execute('DELETE FROM tareas WHERE id_tarea = ?', [id_tarea]);
    res.json({ message: 'Tarea eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};