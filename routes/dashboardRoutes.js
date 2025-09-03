// routes/dashboard.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

const auth = require('../middleware/auth');

router.get('/dash', dashboardController.getDashboardStats);

module.exports = router;