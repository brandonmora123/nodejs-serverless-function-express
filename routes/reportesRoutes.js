 
const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportesController');
const auth = require('../middleware/auth');

// Acceso a reportes para todos los roles
router.get('/dashboard', auth(), reportesController.dashboard);
router.get('/campanas', auth(), reportesController.reportePorCampana);

// Más reportes: por donante, periodo, etc.
router.get('/donantes', auth(), (req, res) => {
  res.json({ message: 'Reporte por donante' });
});

router.get('/periodo', auth(), (req, res) => {
  res.json({ message: 'Reporte por periodo' });
});

module.exports = router;