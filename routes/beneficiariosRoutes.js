 
const express = require('express');
const router = express.Router();
const beneficiariosController = require('../controllers/beneficiariosController');
const auth = require('../middleware/auth');

// Listar y crear beneficiarios
router.get('/', auth(['Administrador', 'Operador']), beneficiariosController.listarBeneficiarios);
router.post('/', auth(['Administrador', 'Operador']), beneficiariosController.crearBeneficiario);
router.get('/:id', auth(['Administrador', 'Operador', 'Voluntario']), beneficiariosController.obtenerPorId);

module.exports = router;