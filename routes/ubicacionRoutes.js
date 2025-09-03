// routes/ubicaciones.js
const express = require('express');
const router = express.Router();
const ubicacionController = require('../controllers/ubicacionController');
const auth = require('../middleware/auth'); // Ajusta según tu middleware

// Rutas públicas (o con auth)
router.get('/provincias', auth(['Administrador', 'Operador']), ubicacionController.listarProvincias);
router.get('/provincias/:id_provincia/cantones', auth(['Administrador', 'Operador']), ubicacionController.listarCantonesPorProvincia);
router.get('/cantones/:id_canton/distritos', auth(['Administrador', 'Operador']), ubicacionController.listarDistritosPorCanton);
router.get('/', auth(['Administrador', 'Operador']), ubicacionController.listarTodosDistritos);

module.exports = router;