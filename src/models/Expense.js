const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Expense title or description is required'],
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0.01, 'Expense amount must be greater than zero'],
    },
    category: {
      type: String,
      enum: ['Transport', 'Meals', 'Stock Purchase', 'Rent/Utilities', 'Miscellaneous'],
      default: 'Miscellaneous',
    },
    receiptImageUrl: {
      type: String, // Optional URL for uploaded receipt image
      default: null,
    },
    salespersonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    expenseDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);