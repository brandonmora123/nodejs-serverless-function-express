 
const express = require('express');
const router = express.Router();
const donacionesController = require('../controllers/donacionesController');
const auth = require('../middleware/auth');

// Rutas protegidas
router.get('/', auth(['Administrador', 'Operador', 'Voluntario']), donacionesController.listarDonaciones);
router.post('/', auth(['Administrador', 'Operador']), donacionesController.crearDonacion);
router.get('/alertas-vencimiento', auth(['Administrador', 'Operador']), donacionesController.alertasVencimiento);
router.get('/donante/:id', auth(['Administrador', 'Operador']), donacionesController.listarDonacionesPorDonante);

module.exports = router;