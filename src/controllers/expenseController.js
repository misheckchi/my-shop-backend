const Expense = require('../models/Expense');

// @desc    Log a new operational expense
// @route   POST /api/expenses
// @access  Public
exports.createExpense = async (req, res) => {
  try {
    const { title, amount, category, receiptImageUrl, salespersonId } = req.body;

    if (!title || !amount) {
      return res.status(400).json({ success: false, message: 'Title and amount are required.' });
    }

    const expense = await Expense.create({
      title,
      amount,
      category: category || 'Miscellaneous',
      receiptImageUrl,
      salespersonId,
    });

    res.status(201).json({
      success: true,
      message: 'Expense logged successfully',
      data: expense,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all logged expenses for today
// @route   GET /api/expenses
// @access  Public
exports.getDailyExpenses = async (req, res) => {
  try {
    const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
    const endOfDay = new Date(new Date().setHours(23, 59, 59, 999));

    const expenses = await Expense.find({
      expenseDate: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ expenseDate: -1 });

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};