 
const express = require('express');
const router = express.Router();
const paquetesController = require('../controllers/paquetesController');
const auth = require('../middleware/auth');

// Acceso para Administrador y Operador
router.get('/', auth(['Administrador', 'Operador']), paquetesController.listarPaquetes);
router.get('/codigo/:codigo_unico', auth(['Administrador', 'Operador', 'Voluntario']), paquetesController.obtenerPorCodigo);
router.post('/', auth(['Administrador', 'Operador']), paquetesController.crearPaquete);

module.exports = router;