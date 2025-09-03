 
const express = require('express');
const router = express.Router();
const entregasController = require('../controllers/entregasController');
const auth = require('../middleware/auth');

// Subida de archivos
router.use(entregasController.upload);

// Registrar entrega: Operador y Voluntario
router.post('/', auth(['Administrador','Operador', 'Voluntario']), entregasController.registrarEntrega);
router.get('/', auth(['Administrador', 'Operador']), entregasController.listarEntregas);

module.exports = router;