// routes/reportesRoutes.js
const express = require('express');
const router = express.Router();
const excelController = require('../controllers/excelController');
const auth = require('../middleware/auth');

router.get('/reporte-semanal', auth(['Administrador','Operador', 'Voluntario']), excelController.generarReporteSemanal);

module.exports = router;
