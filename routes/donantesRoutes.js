 
const express = require('express');
const router = express.Router();
const donantesController = require('../controllers/donantesController');
const auth = require('../middleware/auth');

// Listar y registrar donantes
router.get('/', auth(['Administrador', 'Operador']), donantesController.listarDonantes);
router.post('/', auth(['Administrador', 'Operador']), donantesController.crearDonante);
router.get('/:id/historial', auth(['Administrador', 'Operador']), donantesController.historialDonaciones);
// routes/donaciones.js
router.get('/:id', auth(['Administrador', 'Operador']), donantesController.obtenerDonante);

module.exports = router;