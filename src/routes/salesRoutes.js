const express = require('express');
const router = express.Router();
const { createSale, getDailySummary, getAllSales } = require('../controllers/salesController');

// Map endpoints
router.post('/', createSale);
router.get('/', getAllSales);
router.get('/summary', getDailySummary);

module.exports = router;