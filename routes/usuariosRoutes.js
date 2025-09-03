 
const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const auth = require('../middleware/auth');

// Solo Administrador puede gestionar usuarios
router.get('/', auth(['Administrador']), usuariosController.listarUsuarios);
router.post('/', auth(['Administrador']), usuariosController.crearUsuario);

module.exports = router;