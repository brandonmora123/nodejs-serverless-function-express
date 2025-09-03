// routes/campanas.js
const express = require('express');
const router = express.Router();
const campanasController = require('../controllers/campanasController');
const auth = require('../middleware/auth');

// Todos pueden listar, solo Admin y Operador pueden crear/asignar
router.get('/', auth(['Administrador', 'Operador', 'Voluntario']), campanasController.listarCampanas);
router.post('/', auth(['Administrador', 'Operador']), campanasController.crearCampana);
router.post('/asignar-donacion', auth(['Administrador', 'Operador']), campanasController.asignarDonacion);

module.exports = router;
