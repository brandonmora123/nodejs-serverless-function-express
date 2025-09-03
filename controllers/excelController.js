const ExcelJS = require('exceljs');
const db = require('../models/db'); // Asegúrate de que la ruta sea correcta

exports.generarReporteSemanal = async (req, res) => {
  try {
    // Consultar donaciones de los últimos 7 días
    const [donaciones] = await db.execute(`
      SELECT fecha_ingreso, descripcion, cantidad, estado
      FROM donaciones
      WHERE fecha_ingreso >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      ORDER BY fecha_ingreso
    `);

    // Crear libro de Excel
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Donaciones Últimos 7 días');

    // Columnas
    sheet.columns = [
      { header: 'Fecha', key: 'fecha', width: 15 },
      { header: 'Descripción', key: 'descripcion', width: 30 },
      { header: 'Cantidad', key: 'cantidad', width: 10 },
      { header: 'Estado', key: 'estado', width: 15 },
    ];

    // Rellenar filas
    donaciones.forEach(d => {
      sheet.addRow({
        fecha: d.fecha_ingreso.toISOString().split('T')[0],
        descripcion: d.descripcion,
        cantidad: d.cantidad,
        estado: d.estado,
      });
    });

    // Configurar cabecera de respuesta
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=donaciones_7dias.xlsx'
    );

    // Enviar archivo
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Error generando reporte:', err);
    res.status(500).json({ error: 'No se pudo generar el reporte' });
  }
};
