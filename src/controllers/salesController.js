const mongoose = require('mongoose');
const Sale = require('../models/Sale');
const Item = require('../models/Item');
const Expense = require('../models/Expense');

// @desc    Log a new sale & decrease inventory stock
// @route   POST /api/sales
// @access  Public (or Protected)
exports.createSale = async (req, res) => {
  try {
    const { itemId, quantity, items, paymentMethod, salespersonId } = req.body;

    const salesToCreate = [];
    const itemsToUpdate = [];

    // Standardize input to a list of items
    const itemList = items && Array.isArray(items)
      ? items
      : [{ itemId, quantity }];

    for (const entry of itemList) {
      if (!entry.itemId || !entry.quantity) {
        return res.status(400).json({ success: false, message: 'Item ID and quantity are required for all items.' });
      }

      const item = await Item.findById(entry.itemId);
      if (!item) {
        return res.status(404).json({ success: false, message: `Item not found: ${entry.itemId}` });
      }

      if (item.stockQuantity < entry.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.name}. Only ${item.stockQuantity} remaining.`,
        });
      }

      const totalAmount = item.sellingPrice * entry.quantity;

      salesToCreate.push({
        item: item._id,
        itemName: item.name,
        quantity: entry.quantity,
        unitPrice: item.sellingPrice,
        totalAmount,
        paymentMethod: paymentMethod || 'Cash',
        salespersonId,
        transactionDate: new Date(),
      });

      itemsToUpdate.push({
        itemDoc: item,
        newQuantity: item.stockQuantity - entry.quantity
      });
    }

    // Save all sales and update all stock
    const createdSales = await Sale.insertMany(salesToCreate);

    for (const update of itemsToUpdate) {
      update.itemDoc.stockQuantity = update.newQuantity;
      await update.itemDoc.save();
    }

    res.status(201).json({
      success: true,
      message: 'Sale(s) logged successfully',
      count: createdSales.length,
      data: createdSales,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get daily summary: Gross Sales, Total Expenses, and Net Profit
// @route   GET /api/sales/summary
// @access  Public (or Protected)
exports.getDailySummary = async (req, res) => {
  try {
    // Determine target date range
    const dateQuery = req.query.date ? new Date(req.query.date) : new Date();

    const startOfDay = new Date(dateQuery);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(dateQuery);
    endOfDay.setHours(23, 59, 59, 999);

    // 1. Aggregate Sales Total for today
    const salesAggregation = await Sale.aggregate([
      {
        $match: {
          transactionDate: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: null,
          grossSales: { $sum: '$totalAmount' },
          totalTransactions: { $sum: 1 },
          totalUnitsSold: { $sum: '$quantity' },
        },
      },
    ]);

    // 2. Aggregate Expenses Total for today
    const expenseAggregation = await Expense.aggregate([
      {
        $match: {
          expenseDate: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: '$amount' },
          totalExpenseLogs: { $sum: 1 },
        },
      },
    ]);

    // Extract totals or default to 0
    const grossSales = salesAggregation[0]?.grossSales || 0;
    const totalExpenses = expenseAggregation[0]?.totalExpenses || 0;
    const netProfit = grossSales - totalExpenses;

    res.status(200).json({
      success: true,
      date: startOfDay.toISOString().split('T')[0],
      summary: {
        grossSales,
        totalExpenses,
        netProfit,
        totalTransactions: salesAggregation[0]?.totalTransactions || 0,
        totalUnitsSold: salesAggregation[0]?.totalUnitsSold || 0,
        totalExpenseLogs: expenseAggregation[0]?.totalExpenseLogs || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all sales records
// @route   GET /api/sales
// @access  Public
exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find().sort({ transactionDate: -1 });
    res.status(200).json({
      success: true,
      count: sales.length,
      data: sales,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};