const express = require('express');
const router = express.Router();
const { createExpense, getDailyExpenses } = require('../controllers/expenseController');

router.post('/', createExpense);
router.get('/', getDailyExpenses);

module.exports = router;