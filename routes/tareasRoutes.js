 
const express = require('express');
const router = express.Router();
const tareasController = require('../controllers/tareasController');
const auth = require('../middleware/auth');

// Listar y crear tareas
router.get('/', auth(['Administrador', 'Operador', 'Voluntario']), tareasController.listarTareas);
router.post('/', auth(['Administrador', 'Operador']), tareasController.crearTarea);

module.exports = router;