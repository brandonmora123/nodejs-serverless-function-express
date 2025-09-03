// controllers/dashboardController.js
const db = require('../models/db');

exports.getDashboardStats = async (req, res) => {
  try {
    const [
      [inventario],
      [entregas],
      [campanas],
      [donacionesHoy],
      donacionesSemanaRaw,
      alertasRaw
    ] = await Promise.all([
      // Inventario disponible
      db.execute(`
        SELECT COALESCE(SUM(cantidad), 0) AS total 
        FROM donaciones 
        WHERE estado = 'Disponible'
      `),

      // Entregas realizadas
      db.execute(`SELECT COUNT(*) AS total FROM entrega`),

      // Campañas activas
      db.execute(`SELECT COUNT(*) AS total FROM campanas WHERE estado = 'Activa'`),

      // Donaciones de hoy
      db.execute(`
        SELECT COUNT(*) AS total 
        FROM donaciones 
        WHERE DATE(fecha_ingreso) = CURDATE()
      `),

      // Donaciones últimos 7 días
      db.execute(`
        SELECT 
          DATE(fecha_ingreso) AS fecha, 
          COUNT(*) AS total
        FROM donaciones 
        WHERE fecha_ingreso >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        GROUP BY DATE(fecha_ingreso)
        ORDER BY fecha
      `),

      // Alertas: productos próximos a vencer o bajo stock
      db.execute(`
        SELECT 
          'Vencimiento' AS tipo,
          CONCAT(descripcion, ' - ', cantidad, ' unidades próximas a vencer') AS descripcion
        FROM donaciones 
        WHERE estado = 'Disponible' 
          AND DATE(fecha_vencimiento) BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
        UNION ALL
        SELECT 
          'Stock bajo' AS tipo,
          CONCAT(descripcion, ' - Solo ', cantidad, ' unidades') AS descripcion
        FROM donaciones 
        WHERE estado = 'Disponible' AND cantidad <= 10
        ORDER BY tipo
      `)
    ]);

    // Generar últimos 7 días en formato YYYY-MM-DD
    const diasSemana = [];
    const hoy = new Date();
    for (let i = 6; i >= 0; i--) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() - i);
      diasSemana.push(fecha.toISOString().split('T')[0]);
    }

    // Normalizar resultados de MySQL para donaciones por fecha
    const donacionesSemana = donacionesSemanaRaw[0].map(d => ({
      fecha: d.fecha ? new Date(d.fecha).toISOString().split('T')[0] : null,
      total: parseInt(d.total)
    }));

    // Llenar dataset del gráfico con valores por día
    const datosSemana = diasSemana.map(fecha => {
      const encontrado = donacionesSemana.find(d => d.fecha === fecha);
      return encontrado ? encontrado.total : 0;
    });

    // Mapear alertas correctamente
    const alertas = alertasRaw[0].map(a => ({
      tipo: a.tipo || 'Alerta desconocida',
      descripcion: a.descripcion || 'Sin descripción'
    }));

    // Enviar respuesta al frontend
    res.json({
      inventario: parseInt(inventario[0].total),
      entregas: parseInt(entregas[0].total),
      campanas: parseInt(campanas[0].total),
      donacionesHoy: parseInt(donacionesHoy[0].total),
      donacionesSemana: {
        labels: diasSemana.map(f => new Date(f).toLocaleDateString('es-ES', { weekday: 'short' })),
        data: datosSemana
      },
      alertas
    });
  } catch (err) {
    console.error('Error en getDashboardStats:', err);
    res.status(500).json({ error: err.message });
  }
};
