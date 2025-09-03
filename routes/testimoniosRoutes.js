 
const express = require('express');
const router = express.Router();
const testimoniosController = require('../controllers/testimoniosController');
const auth = require('../middleware/auth');

// Registrar y listar testimonios
router.post('/', auth(['Administrador','Operador', 'Voluntario']), testimoniosController.registrarTestimonio);
router.get('/', auth(['Administrador', 'Operador']), testimoniosController.listarTestimonios);

module.exports = router;